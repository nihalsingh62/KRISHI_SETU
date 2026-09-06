import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_CENTRES, INITIAL_SLOTS, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from "../data/mockData";
import { translations } from "../data/translations";

const KisanSetuContext = createContext();

// Helper to initialize state from localStorage or fallback
const getInitialState = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage for ${key}`, error);
    return fallback;
  }
};

export const KisanSetuProvider = ({ children }) => {
  // Persistent State
  const [language, setLanguage] = useState(() => getInitialState("ks_language", "en"));
  const [lowNetworkMode, setLowNetworkMode] = useState(() => getInitialState("ks_lowNetworkMode", false));
  const [currentRole, setCurrentRole] = useState(() => getInitialState("ks_currentRole", "landing"));
  const [isAuthenticated, setIsAuthenticated] = useState(() => getInitialState("ks_isAuthenticated", false));
  const [authenticatedUser, setAuthenticatedUser] = useState(() => getInitialState("ks_authenticatedUser", null));
  const [registeredFarmers, setRegisteredFarmers] = useState(() => getInitialState("ks_registeredFarmers", [
    { id: "FAR-1001", name: "Ramesh Singh", mobile: "9876543210", aadhaar: "987654321098" } // seed
  ]));
  
  const [centres, setCentres] = useState(() => getInitialState("ks_centres", INITIAL_CENTRES));
  const [slots, setSlots] = useState(() => getInitialState("ks_slots", INITIAL_SLOTS));
  const [bookings, setBookings] = useState(() => getInitialState("ks_bookings", INITIAL_BOOKINGS));
  const [notifications, setNotifications] = useState(() => getInitialState("ks_notifications", INITIAL_NOTIFICATIONS));
  
  // Navigation Tabs persistence
  const [activeFarmerTab, setActiveFarmerTab] = useState(() => getInitialState("ks_activeFarmerTab", "dashboard"));
  const [activeOperatorTab, setActiveOperatorTab] = useState(() => getInitialState("ks_activeOperatorTab", "queue"));
  const [activeAdminTab, setActiveAdminTab] = useState(() => getInitialState("ks_activeAdminTab", "monitoring"));

  const [activeCentreId, setActiveCentreId] = useState(() => getInitialState("ks_activeCentreId", "c1"));

  // Persist State Changes
  useEffect(() => { localStorage.setItem("ks_language", JSON.stringify(language)); }, [language]);
  useEffect(() => { localStorage.setItem("ks_lowNetworkMode", JSON.stringify(lowNetworkMode)); }, [lowNetworkMode]);
  useEffect(() => { localStorage.setItem("ks_currentRole", JSON.stringify(currentRole)); }, [currentRole]);
  useEffect(() => { localStorage.setItem("ks_isAuthenticated", JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem("ks_authenticatedUser", JSON.stringify(authenticatedUser)); }, [authenticatedUser]);
  useEffect(() => { localStorage.setItem("ks_registeredFarmers", JSON.stringify(registeredFarmers)); }, [registeredFarmers]);
  useEffect(() => { localStorage.setItem("ks_centres", JSON.stringify(centres)); }, [centres]);
  useEffect(() => { localStorage.setItem("ks_slots", JSON.stringify(slots)); }, [slots]);
  useEffect(() => { localStorage.setItem("ks_bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("ks_notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("ks_activeFarmerTab", JSON.stringify(activeFarmerTab)); }, [activeFarmerTab]);
  useEffect(() => { localStorage.setItem("ks_activeOperatorTab", JSON.stringify(activeOperatorTab)); }, [activeOperatorTab]);
  useEffect(() => { localStorage.setItem("ks_activeAdminTab", JSON.stringify(activeAdminTab)); }, [activeAdminTab]);
  useEffect(() => { localStorage.setItem("ks_activeCentreId", JSON.stringify(activeCentreId)); }, [activeCentreId]);

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  // Farmer Registration
  const registerFarmer = (details) => {
    const newId = `FAR-${1000 + registeredFarmers.length + 1}`;
    const newFarmer = {
      id: newId,
      ...details,
      createdAt: new Date().toISOString()
    };
    setRegisteredFarmers(prev => [...prev, newFarmer]);
    return newFarmer;
  };

  // Farmer Login
  const loginFarmer = (farmerId, mobile) => {
    const farmer = registeredFarmers.find(f => f.id === farmerId && f.mobile === mobile);
    if (farmer) {
      login("farmer", { ...farmer, type: "farmer" });
      return true;
    }
    return false;
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

  // Calculate active token based on authenticated user
  const getActiveBooking = () => {
    if (currentRole === "farmer" && authenticatedUser) {
      // Find the most recent token for this farmer
      const farmerTokens = bookings.filter(t => t.farmerId === authenticatedUser.id || t.farmerName === authenticatedUser.name);
      return farmerTokens.length > 0 ? farmerTokens[farmerTokens.length - 1] : null;
    }
    return null;
  };
  const activeBooking = getActiveBooking();
  const activeCentre = centres.find((c) => c.id === activeCentreId) || centres[0];


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

  const recalculateQueuePositions = (tokenList) => {
    // Re-evaluate queue positions for each centre based on active waiting bookings
    const updated = [...tokenList];
    const centresSet = new Set(updated.map(t => t.centreId));
    
    centresSet.forEach(cId => {
      // Find bookings in queue (BOOKED, WAITING, ARRIVED) for this centre
      const inQueueTokens = updated.filter(t => t.centreId === cId && ["BOOKED", "WAITING", "ARRIVED"].includes(t.status));
      // Sort them by their current queuePos or time (simulated by ID logic or bookedAt)
      inQueueTokens.sort((a, b) => a.id.localeCompare(b.id));
      
      inQueueTokens.forEach((tok, index) => {
        // Queue position is index + 1
        const tIndex = updated.findIndex(t => t.bookingId === tok.bookingId);
        if (tIndex !== -1) {
          updated[tIndex].queuePos = index + 1;
          updated[tIndex].estimatedWaitMin = Math.max(10, Math.round((index + 1) * 6)); // Rough estimate dynamically decreasing
        }
      });
    });
    return updated;
  };

  // Booking a slot by farmer
  const bookSlot = ({ commodity, quantityQtl, centreId, date, slotTime }) => {
    if (!authenticatedUser) return null;

    const bookingId = `BKG-${Date.now()}`;
    const nextTokenNum = `A${125 + bookings.length - 5}`;
    const centre = centres.find((c) => c.id === centreId) || centres[0];
    const msp = commodity === "Wheat" ? 2275 : commodity === "Paddy" ? 2300 : 2090;
    const estWait = Math.max(10, Math.round(centre.queueDepth * (centre.avgProcessingMin / centre.activeCounters)));

    const newBooking = {
      bookingId: bookingId,
      id: bookingId,
      token: nextTokenNum,
      farmerId: authenticatedUser.id,
      farmerName: authenticatedUser.name,
      phone: authenticatedUser.mobile,
      crop: commodity,
      commodity: commodity,
      quantity: Number(quantityQtl),
      quantityQtl: Number(quantityQtl),
      centreId,
      centreName: centre.name,
      date: date,
      slot: slotTime,
      status: "BOOKED",
      queuePosition: centre.queueDepth + 1,
      queuePos: centre.queueDepth + 1,
      estimatedWait: estWait,
      estimatedWaitMin: estWait,
      actualWeightQtl: null,
      moisturePercent: null,
      grade: null,
      mspPerQtl: msp,
      totalAmount: Math.round(Number(quantityQtl) * msp),
      paymentStatus: "NOT_INITIATED",
      paymentTxRef: null,
      createdAt: new Date().toISOString(),
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timelineHistory: [
        { status: "BOOKED", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), desc: `Slot booked at ${centre.name} for ${slotTime}` }
      ]
    };

    let updatedTokens = [...bookings, newBooking];
    updatedTokens = recalculateQueuePositions(updatedTokens);
    
    setBookings(updatedTokens);

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

    return newBooking;
  };

  // Updating status from operator portal
  const updateBookingStatus = (bookingId, newStatus, extraData = {}) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let notifyMsg = "";

    const updatedTokens = bookings.map((tok) => {
      if (tok.bookingId !== bookingId) return tok;

      const history = [...tok.timelineHistory];
      let updatedObj = { ...tok, status: newStatus, updatedAt: nowIso };

      if (newStatus === "ARRIVED") {
        history.push({ status: "ARRIVED", time: nowTime, desc: "Checked-in at Gate 1" });
        notifyMsg = `Token ${updatedObj.token}: Farmer checked-in at gate.`;
      } else if (newStatus === "CALLED") {
        history.push({ status: "CALLED", time: nowTime, desc: "Called for weighing" });
        notifyMsg = `Token ${updatedObj.token}: Proceed to Weighbridge.`;
      } else if (newStatus === "WEIGHING") {
        const weight = extraData.actualWeightQtl || tok.actualWeightQtl || (tok.quantityQtl + 0.5);
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.round(weight * tok.mspPerQtl);
        history.push({ status: "WEIGHING", time: nowTime, desc: `Vehicle on Weighbridge. Recorded: ${weight} Qtl` });
        notifyMsg = `Token ${updatedObj.token}: Weighbridge weighing completed (${weight} Qtl).`;
      } else if (newStatus === "QUALITY_CHECK") {
        const moisture = extraData.moisturePercent || 12.0;
        const grade = extraData.grade || "Grade A";
        updatedObj.moisturePercent = moisture;
        updatedObj.grade = grade;
        history.push({ status: "QUALITY_CHECK", time: nowTime, desc: `Passed Quality Test (${moisture}% Moisture, ${grade})` });
        notifyMsg = `Token ${updatedObj.token}: Quality inspection passed (${grade}).`;
      } else if (newStatus === "PROCUREMENT_COMPLETE") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PROCUREMENT_COMPLETE", time: nowTime, desc: "Procurement completed & digital receipt generated" });
        notifyMsg = `Token ${updatedObj.token}: Procurement complete! Payment initiated.`;
      } else if (newStatus === "PAYMENT_PROCESSING") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PAYMENT_PROCESSING", time: nowTime, desc: "PFMS / Bank Transfer Verification in progress" });
        notifyMsg = `Token ${updatedObj.token}: Direct payment processing underway.`;
      } else if (newStatus === "PAYMENT_COMPLETED") {
        const txRef = `DEMO-TRX-${Math.floor(10000 + Math.random() * 90000)}`;
        updatedObj.paymentStatus = "COMPLETED";
        updatedObj.paymentTxRef = txRef;
        history.push({ status: "PAYMENT_COMPLETED", time: nowTime, desc: `Direct Bank Transfer Successful (Ref: ${txRef})` });
        notifyMsg = `Token ${updatedObj.token}: ₹${updatedObj.totalAmount.toLocaleString()} credited to bank account (Ref: ${txRef}).`;
      } else if (newStatus === "REJECTED") {
        history.push({ status: "REJECTED", time: nowTime, desc: `Procurement rejected: ${extraData.remarks || 'Failed quality check'}` });
        notifyMsg = `Token ${updatedObj.token}: Procurement rejected.`;
      }

      updatedObj.timelineHistory = history;
      updatedObj.updatedAt = new Date().toISOString();
      return updatedObj;
    });

    const finalizedTokens = recalculateQueuePositions(updatedTokens);

    setBookings(finalizedTokens);
    setCentres((prev) => recalculateCentreMetrics(prev, finalizedTokens));

    if (notifyMsg) {
      addNotification({
        type: newStatus,
        title: `Status Update (${updatedObj.token})`,
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

  // Used for updating a farmer's bank details profile
  const updateFarmerBankDetails = (farmerId, newBankDetails) => {
    setRegisteredFarmers(prev => prev.map(f => {
      if(f.id === farmerId) {
        return { ...f, bankDetails: newBankDetails };
      }
      return f;
    }));
    if (authenticatedUser && authenticatedUser.id === farmerId) {
      setAuthenticatedUser(prev => ({ ...prev, bankDetails: newBankDetails }));
    }
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
        registeredFarmers,
        registerFarmer,
        loginFarmer,
        updateFarmerBankDetails,
        centres,
        slots,
        bookings,
        notifications,
        activeCentreId,
        setActiveCentreId,
        activeBooking, // dynamically computed based on authenticatedUser
        activeCentre,
        bookSlot,
        updateBookingStatus,
        updateCentreCapacity,
        updateSlotCapacity,
        addNotification,
        activeFarmerTab,
        setActiveFarmerTab,
        activeOperatorTab,
        setActiveOperatorTab,
        activeAdminTab,
        setActiveAdminTab
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
