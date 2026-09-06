import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_CENTRES, INITIAL_SLOTS, INITIAL_TOKENS, INITIAL_NOTIFICATIONS } from "../data/mockData";
import { translations } from "../data/translations";

const KisanSetuContext = createContext();

export const KisanSetuProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [lowNetworkMode, setLowNetworkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState("landing"); // landing | farmer | operator | admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  
  const [centres, setCentres] = useState(INITIAL_CENTRES);
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFarmerTokenId, setActiveFarmerTokenId] = useState("A124"); // Ramesh Singh
  const [activeCentreId, setActiveCentreId] = useState("c1"); // ABC Procurement Centre
  const [demoStep, setDemoStep] = useState(0);

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  // Helper to re-calculate centre congestion load % & status
  const recalculateCentreMetrics = (centreList, tokenList) => {
    return centreList.map((centre) => {
      const centreTokens = tokenList.filter((tok) => tok.centreId === centre.id);
      const booked = centreTokens.filter((tok) => tok.status !== "CANCELLED").length;
      const arrived = centreTokens.filter((tok) => ["ARRIVED", "WEIGHING", "QUALITY_CHECK", "PROCUREMENT_COMPLETE", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(tok.status)).length;
      const processing = centreTokens.filter((tok) => ["WEIGHING", "QUALITY_CHECK"].includes(tok.status)).length;
      const completed = centreTokens.filter((tok) => ["PROCUREMENT_COMPLETE", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(tok.status)).length;
      const queueDepth = centreTokens.filter((tok) => ["WAITING", "BOOKED", "ARRIVED"].includes(tok.status)).length;

      const loadPercent = Math.min(100, Math.round((booked / centre.capacity) * 100));
      let status = "NORMAL";
      if (loadPercent >= 95) status = "CRITICAL";
      else if (loadPercent >= 80) status = "HIGH_LOAD";

      return {
        ...centre,
        booked,
        arrived,
        processing,
        completed,
        queueDepth,
        loadPercent,
        status
      };
    });
  };

  // Booking a slot by farmer
  const bookSlot = ({ farmerName, phone, commodity, quantityQtl, centreId, date, slotTime }) => {
    const nextTokenNum = `A${125 + tokens.length - 5}`;
    const centre = centres.find((c) => c.id === centreId) || centres[0];
    const msp = commodity === "Wheat" ? 2275 : commodity === "Paddy" ? 2300 : 2090;
    const estWait = Math.max(10, Math.round(centre.queueDepth * (centre.avgProcessingMin / centre.activeCounters)));

    const newToken = {
      id: nextTokenNum,
      farmerName: farmerName || "Ramesh Singh",
      phone: phone || "+91 98765 43210",
      commodity,
      quantityQtl: Number(quantityQtl),
      centreId,
      slot: slotTime,
      status: "BOOKED",
      queuePos: centre.queueDepth + 1,
      estimatedWaitMin: estWait,
      actualWeightQtl: null,
      moisturePercent: null,
      grade: null,
      mspPerQtl: msp,
      totalAmount: Math.round(Number(quantityQtl) * msp),
      paymentStatus: "NOT_INITIATED",
      paymentTxRef: null,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timelineHistory: [
        { status: "BOOKED", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), desc: `Slot booked at ${centre.name} for ${slotTime}` }
      ]
    };

    const updatedTokens = [...tokens, newToken];
    setTokens(updatedTokens);
    setActiveFarmerTokenId(nextTokenNum);

    // Update slots
    setSlots((prevSlots) =>
      prevSlots.map((s) => {
        if (s.time === slotTime) {
          const newBooked = s.booked + 1;
          return { ...s, booked: newBooked, status: newBooked >= s.capacity ? "FULL" : "AVAILABLE" };
        }
        return s;
      })
    );

    // Recalculate centre load
    setCentres((prev) => recalculateCentreMetrics(prev, updatedTokens));

    // Push notification
    addNotification({
      type: "SLOT_CONFIRMED",
      title: "Booking Confirmed",
      message: `Token ${nextTokenNum} issued for ${commodity} (${quantityQtl} Qtl) at ${centre.name}.`,
      time: "Just now"
    });

    return newToken;
  };

  // Updating status from operator portal
  const updateTokenStatus = (tokenId, newStatus, extraData = {}) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let notifyMsg = "";

    const updatedTokens = tokens.map((tok) => {
      if (tok.id !== tokenId) return tok;

      const history = [...tok.timelineHistory];
      let updatedObj = { ...tok, status: newStatus };

      if (newStatus === "ARRIVED") {
        history.push({ status: "ARRIVED", time: nowTime, desc: "Checked-in at Gate 1" });
        notifyMsg = `Token ${tokenId}: Farmer checked-in at gate.`;
      } else if (newStatus === "WEIGHING") {
        const weight = extraData.actualWeightQtl || tok.actualWeightQtl || (tok.quantityQtl + 0.5);
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.round(weight * tok.mspPerQtl);
        history.push({ status: "WEIGHING", time: nowTime, desc: `Vehicle on Weighbridge #1. Recorded: ${weight} Qtl` });
        notifyMsg = `Token ${tokenId}: Weighbridge weighing completed (${weight} Qtl).`;
      } else if (newStatus === "QUALITY_CHECK") {
        const moisture = extraData.moisturePercent || 12.0;
        const grade = extraData.grade || "Grade A";
        updatedObj.moisturePercent = moisture;
        updatedObj.grade = grade;
        history.push({ status: "QUALITY_CHECK", time: nowTime, desc: `Passed Quality Test (${moisture}% Moisture, ${grade})` });
        notifyMsg = `Token ${tokenId}: Quality inspection passed (${grade}).`;
      } else if (newStatus === "PROCUREMENT_COMPLETE") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PROCUREMENT_COMPLETE", time: nowTime, desc: "Procurement completed & digital receipt generated" });
        notifyMsg = `Token ${tokenId}: Procurement complete! Payment initiated.`;
      } else if (newStatus === "PAYMENT_PROCESSING") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PAYMENT_PROCESSING", time: nowTime, desc: "PFMS / Bank Transfer Verification in progress" });
        notifyMsg = `Token ${tokenId}: Direct payment processing underway.`;
      } else if (newStatus === "PAYMENT_COMPLETED") {
        const txRef = `DEMO-TRX-${Math.floor(10000 + Math.random() * 90000)}`;
        updatedObj.paymentStatus = "COMPLETED";
        updatedObj.paymentTxRef = txRef;
        history.push({ status: "PAYMENT_COMPLETED", time: nowTime, desc: `Direct Bank Transfer Successful (Ref: ${txRef})` });
        notifyMsg = `Token ${tokenId}: ₹${updatedObj.totalAmount.toLocaleString()} credited to bank account (Ref: ${txRef}).`;
      } else if (newStatus === "NO_SHOW") {
        history.push({ status: "NO_SHOW", time: nowTime, desc: "Farmer flagged as No-Show by operator" });
        notifyMsg = `Token ${tokenId}: Marked as No-Show. Contact centre to reschedule.`;
      } else if (newStatus === "RESCHEDULED") {
        updatedObj.slot = extraData.newSlot || "11:30 AM – 12:00 PM";
        history.push({ status: "RESCHEDULED", time: nowTime, desc: `Rescheduled to ${updatedObj.slot}` });
        notifyMsg = `Token ${tokenId}: Slot rescheduled to ${updatedObj.slot}.`;
      }

      updatedObj.timelineHistory = history;
      return updatedObj;
    });

    setTokens(updatedTokens);
    setCentres((prev) => recalculateCentreMetrics(prev, updatedTokens));

    if (notifyMsg) {
      addNotification({
        type: newStatus,
        title: `Status Update (${tokenId})`,
        message: notifyMsg,
        time: "Just now"
      });
    }
  };

  const updateCentreCapacity = (centreId, updates) => {
    setCentres((prevCentres) =>
      prevCentres.map((c) => {
        if (c.id !== centreId) return c;
        const updated = { ...c, ...updates };
        const loadPercent = Math.min(100, Math.round((updated.booked / updated.capacity) * 100));
        let status = "NORMAL";
        if (loadPercent >= 95) status = "CRITICAL";
        else if (loadPercent >= 80) status = "HIGH_LOAD";
        return { ...updated, loadPercent, status };
      })
    );
  };

  const updateSlotCapacity = (slotTime, changeAmount) => {
    setSlots((prevSlots) =>
      prevSlots.map((s) => {
        if (s.time === slotTime) {
          const newCap = Math.max(5, s.capacity + changeAmount);
          return {
            ...s,
            capacity: newCap,
            status: s.booked >= newCap ? "FULL" : "AVAILABLE"
          };
        }
        return s;
      })
    );
  };

  const addNotification = (notif) => {
    setNotifications((prev) => [{ id: Date.now(), read: false, ...notif }, ...prev]);
  };

  const activeToken = tokens.find((t) => t.id === activeFarmerTokenId) || tokens[4]; // Ramesh A124
  const activeCentre = centres.find((c) => c.id === activeCentreId) || centres[0];

  // Demo walkthrough step runner (19 steps from SIH prompt)
  const runDemoStep = (stepIndex) => {
    setDemoStep(stepIndex);
    if (stepIndex === 0) {
      // Step 1: Open landing
      setCurrentRole("landing");
    } else if (stepIndex === 1) {
      // Step 2-4: Farmer views smart recommendations & picks Centre B (c3) or Centre A (c1)
      setCurrentRole("farmer");
      setActiveFarmerTokenId("A124");
    } else if (stepIndex === 2) {
      // Step 5-7: Farmer chooses slot 10:30, token A124 generated, sees 6 ahead 35 min wait
      setCurrentRole("farmer");
      updateTokenStatus("A124", "BOOKED");
    } else if (stepIndex === 3) {
      // Step 8: Operator sees A124 Ramesh Waiting
      setCurrentRole("operator");
    } else if (stepIndex === 4) {
      // Step 9-10: Operator marks arrived -> Farmer sees Arrived ✓
      updateTokenStatus("A124", "ARRIVED");
    } else if (stepIndex === 5) {
      // Step 11-13: Operator starts weighing (42.5 Qtl) -> Farmer sees Weighing in progress
      updateTokenStatus("A124", "WEIGHING", { actualWeightQtl: 42.5 });
    } else if (stepIndex === 6) {
      // Step 14: Quality check passes
      updateTokenStatus("A124", "QUALITY_CHECK", { moisturePercent: 12.0, grade: "Grade A" });
    } else if (stepIndex === 7) {
      // Step 15-16: Operator completes procurement -> Farmer sees Procurement Completed ✓
      updateTokenStatus("A124", "PROCUREMENT_COMPLETE");
    } else if (stepIndex === 8) {
      // Step 17: Payment becomes Payment Processing
      updateTokenStatus("A124", "PAYMENT_PROCESSING");
    } else if (stepIndex === 9) {
      // Step 18: Payment completed DEMO-TRX-10482
      updateTokenStatus("A124", "PAYMENT_COMPLETED");
    } else if (stepIndex === 10) {
      // Step 19: Admin dashboard view reflecting complete transaction
      setCurrentRole("admin");
    }
  };

  const login = (role, userDetails) => {
    setIsAuthenticated(true);
    setAuthenticatedUser(userDetails);
    setCurrentRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    setCurrentRole("landing");
  };

  return (
    <KisanSetuContext.Provider
      value={{
        language,
        setLanguage,
        t,
        lowNetworkMode,
        setLowNetworkMode,
        currentRole,
        setCurrentRole,
        isAuthenticated,
        authenticatedUser,
        login,
        logout,
        centres,
        slots,
        tokens,
        notifications,
        activeFarmerTokenId,
        setActiveFarmerTokenId,
        activeCentreId,
        setActiveCentreId,
        activeToken,
        activeCentre,
        bookSlot,
        updateTokenStatus,
        updateCentreCapacity,
        updateSlotCapacity,
        addNotification,
        demoStep,
        runDemoStep
      }}
    >
      {children}
    </KisanSetuContext.Provider>
  );
};

export const useKisanSetu = () => {
  const context = useContext(KisanSetuContext);
  if (!context) {
    throw new Error("useKisanSetu must be used within a KisanSetuProvider");
  }
  return context;
};
