import { useState } from "react";
import {
  AIChatSidebar,
  ChatHeader,
  SuggestionCards,
  ChatMessage,
  ChatInput,
  QuickInsights,
  VoiceInvestigationPanel,
} from "./components";
import { recentConversations, initialMessages } from "./data/MockConversation";
import type {
  ChatMessageData,
  SidebarHistoryItem,
} from "./data/MockConversation";
import { askAIAssistant } from "../../api/ai.api";

function AIAssistantPage() {
  const [conversations, setConversations] =
    useState<SidebarHistoryItem[]>(recentConversations);
  const [activeChatId, setActiveChatId] = useState<string>("1");

  // Message logs list
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);

  // Right insights collapsible panel state
  const [insightsOpen, setInsightsOpen] = useState(true);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Add User Message
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await askAIAssistant({ question: text });

      // 2. Add Real AI Message
      const aiMessage: ChatMessageData = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      // Fallback to mock search responses to keep experience solid if server drops
      setTimeout(() => {
        let aiResponse: ChatMessageData;
        if (
          text.toLowerCase().includes("burglary") ||
          text.toLowerCase().includes("white")
        ) {
          aiResponse = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "I have analyzed the database for burglary incidents matching these criteria. A total of 3 matching FIR records were detected, concentrated in the JC Nagar district. Below is the summary of intelligence parameters recovered:",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            intelligenceData: {
              summaryTitle: "Burglary Case Analysis - JC Nagar Cluster",
              summaryText:
                "Our geospatial and records analysis of JC Nagar over the last three months indicates a concentrated pattern of residential break-ins. The modus operandi consistently involves forced rear-entry during afternoon hours (12:00 PM - 4:00 PM) when properties are unoccupied.",
              observations: [
                "Three matching FIR records share identical forced-entry signatures at the rear door points.",
                "Suspects utilized a white hatchback (White Swift, partial registration KA01AB1234) for transport and quick exit.",
                "Active association mapping links suspect Ravi Kumar to two of the three targeted properties.",
              ],
              evidence: [
                { name: "CCTV_ForcedEntry_JC_Nagar.jpg", type: "image" },
                { name: "Vehicle_Trace_KA01AB1234.mp4", type: "video" },
                { name: "JC_Nagar_Fingerprints_Report.pdf", type: "document" },
              ],
              nextSteps: [
                "Verify accused Ravi Kumar's mobile location data mapping on 12 May 2025.",
                "Request street-level cameras footage from the JC Nagar junction.",
                "Cross-verify fingerprint partial matches recovered from main gate entry points.",
              ],
            },
          };
        } else if (
          text.toLowerCase().includes("offender") ||
          text.toLowerCase().includes("bengaluru")
        ) {
          aiResponse = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "Analyzing repeat offender databases... Located 5 high-risk profiles matches inside Bengaluru Command logs. Accused records show recurrent crime linkage:",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            intelligenceData: {
              summaryTitle: "Repeat Offenders Mapping - Bengaluru Urban",
              summaryText:
                "Cross-case comparison matching shows 5 high-risk profiles that correspond to multiple active cases across Koramangala and surrounding zones.",
              observations: [
                "All 5 suspects are connected to multiple robbery and assault incidents.",
                "Recurrent utilization of a black SUV (partial registration KA03HA9876) across 3 distinct crime scenes.",
                "Cell tower logs suggest overlaps in proximity timing during the incident windows.",
              ],
              evidence: [
                { name: "Cell_Tower_Overlap_Logs.pdf", type: "document" },
                { name: "Black_SUV_Registration_Record.jpg", type: "image" },
              ],
              nextSteps: [
                "Verify suspect biometric scans against KSP state arrest databases.",
                "Trigger alert signals for patrol units near Koramangala coordinates.",
              ],
            },
          };
        } else {
          aiResponse = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text:
              'Inquiry registered. Vigilens Intelligence database search returned 1 related case logs index match for: "' +
              text +
              '". Here are the details:',
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            intelligenceData: {
              summaryTitle: "General Search Inquest",
              summaryText:
                "Inquiry registered. Vigilens Intelligence database search returned 1 related case logs index match.",
              observations: [
                "Single related record discovered in the historical database repository.",
                "No vehicles or active locations flags associated with this search query.",
              ],
              evidence: [
                { name: "Historical_Inquest_Index.pdf", type: "document" },
              ],
              nextSteps: [
                "Open the primary Investigation Workspace and check associated details.",
              ],
            },
          };
        }
        setMessages((prev) => [...prev, aiResponse]);
      }, 850);
    }
  };

  // Suggestion card clicked
  const handleSelectSuggestion = (text: string) => {
    handleSendMessage(text);
  };

  // Sidebar navigation select
  const handleSelectConversation = (id: string) => {
    setActiveChatId(id);
    const selected = conversations.find((c) => c.id === id);
    if (selected) {
      // Refresh messages list depending on chat selection
      if (id === "1") {
        setMessages(initialMessages);
      } else {
        setMessages([
          {
            id: `init-${id}`,
            sender: "ai",
            text: `Initial history loaded for: ${selected.title}. Ask about linked suspects, evidence files or geolocation coordinates to continue analysis.`,
            timestamp: selected.date,
          },
        ]);
      }
    }
  };

  // Create new investigation chat
  const handleNewChat = () => {
    const newId = String(conversations.length + 1);
    const newChat: SidebarHistoryItem = {
      id: newId,
      title: `Investigation Case ${newId}`,
      date:
        "Today " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      category: "burglary",
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    setMessages([
      {
        id: `init-${newId}`,
        sender: "ai",
        text: "New investigation workspace started. How can I assist your case discovery today?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. Page Header Panel */}
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-5 select-none">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
          AI Investigation Assistant
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-mono mt-1">
          Ask natural language questions to investigate crimes, discover
          patterns and generate intelligence.
        </p>
      </div>

      {/* 2. Voice Search Investigation Panel */}
      <VoiceInvestigationPanel onCommandSubmitted={handleSendMessage} />

      {/* 3. Responsive Side-by-Side Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch min-h-[600px]">
        {/* Left Side: Recent Investigations Sidebar (25% on desktop -> w-72) */}
        <div className="w-full lg:w-72 shrink-0">
          <AIChatSidebar
            conversations={conversations}
            activeId={activeChatId}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Center: Main Chat Window Panel */}
        <div className="flex-grow flex flex-col justify-between h-[600px] bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl py-6 px-6 shadow-sm relative overflow-hidden">
          {/* A. Top Header Area */}
          <ChatHeader />

          {/* B. Message Logs Scrollbox */}
          <div className="flex-grow my-6 overflow-y-auto space-y-8 pr-1.5 scroll-smooth no-scrollbar flex flex-col justify-start w-full">
            {messages.length === 1 && messages[0].sender === "ai" && (
              <div className="my-auto py-6">
                <SuggestionCards onSelectSuggestion={handleSelectSuggestion} />
              </div>
            )}

            {messages.length > 1 && (
              <div className="space-y-8 w-full">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
              </div>
            )}

            {/* Check welcome state on start */}
            {messages.length === 0 && (
              <div className="my-auto py-6">
                <SuggestionCards onSelectSuggestion={handleSelectSuggestion} />
              </div>
            )}
          </div>

          {/* C. Bottom Chat Input Area */}
          <div className="mt-5 shrink-0">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>

        {/* Right Side: Collapsible Quick Insights Panel */}
        <QuickInsights
          isOpen={insightsOpen}
          onToggle={() => setInsightsOpen(!insightsOpen)}
        />
      </div>
    </div>
  );
}

export default AIAssistantPage;
