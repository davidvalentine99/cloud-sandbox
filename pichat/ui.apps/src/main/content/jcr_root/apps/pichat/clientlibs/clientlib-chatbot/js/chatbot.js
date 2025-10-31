import { u as t, K as me, D as le, Q as se, d as $, y as G, x as ae, P as ye, A as z, _ as be, a as ve, k as Se, G as ke } from "/etc.clientlibs/pichat/clientlibs/clientlib-shared/resources/compat.module-BxTSLgqO.js";
function we({
  showBackButton: n = !0,
  beforeTitle: e,
  title: s,
  titleElement: c,
  afterTitle: a,
  backButton: o,
  backButtonAction: d,
  showCloseButton: l = !0,
  closeButtonAction: r
}) {
  return /* @__PURE__ */ t("header", { class: "pichat-header", children: [
    o || n && /* @__PURE__ */ t(
      "button",
      {
        class: "pichat-icon-button pichat-nav-icon pichat-icon-back",
        "aria-label": "Go back",
        onClick: d
      }
    ),
    e,
    c || s && /* @__PURE__ */ t("h3", { class: "pichat-title", children: s }),
    a,
    l && /* @__PURE__ */ t(
      "button",
      {
        class: "pichat-icon-button pichat-nav-icon pichat-icon-close",
        "aria-label": "Close chat",
        onClick: r
      }
    )
  ] });
}
function Te(n) {
  if (!n) return "";
  let e = n.replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>').replace(/^## (.*$)/gim, '<h3 class="md-h3">$1</h3>').replace(/^# (.*$)/gim, '<h2 class="md-h2">$1</h2>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>").replace(new RegExp("(?<!^|\\n|\\*)\\*([^*\\n]+)\\*", "g"), "<em>$1</em>").replace(/_([^_\n]+)_/g, "<em>$1</em>").replace(/```([^`]+)```/g, "<pre><code>$1</code></pre>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>").replace(/^[*•] (.+)$/gim, "<li>$1</li>").replace(/^- (.+)$/gim, "<li>$1</li>").replace(/^\d+\. (.+)$/gim, "<li>$1</li>");
  return e = e.replace(/(<li>.*?<\/li>\s*)+/g, (s) => '<ul class="md-list">' + s + "</ul>"), e = e.split(/\n\n+/).map((s) => s.trim().startsWith("<h") || s.trim().startsWith("<ul") || s.trim().startsWith("<blockquote") || s.trim().startsWith("<pre") ? s : s.trim() ? `<p>${s}</p>` : "").join(""), e = e.replace(/\n(?!<)/g, " "), e;
}
function Ce({ children: n, className: e = "pichat-message-buttons" }) {
  return /* @__PURE__ */ t("div", { class: e, children: n });
}
function Ie({
  links: n,
  title: e = "These links may be of interest:",
  showTitle: s = !0,
  className: c = "pichat-message-links",
  customContent: a
}) {
  return !n || n.length === 0 ? null : a ? /* @__PURE__ */ t("div", { class: c, children: a }) : /* @__PURE__ */ t("div", { class: c, children: [
    s && /* @__PURE__ */ t("p", { children: e }),
    /* @__PURE__ */ t("ul", { children: n.map((o, d) => /* @__PURE__ */ t("li", { children: [
      /* @__PURE__ */ t("a", { href: o.url, target: "_blank", rel: "noopener noreferrer", title: o.note || o.text, children: o.text }),
      o.note && /* @__PURE__ */ t("span", { class: "pichat-link-note", children: [
        " ",
        o.note
      ] })
    ] }, d)) })
  ] });
}
function _e({ id: n, sender: e, name: s, avatar: c, content: a, links: o, isStreaming: d, status: l, buttons: r, messages: i }) {
  const m = e === "user", y = {
    id: n,
    sender: e,
    name: s,
    avatar: c,
    content: a,
    links: o,
    isStreaming: d
  };
  return /* @__PURE__ */ t("div", { class: `pichat-message ${m ? "pichat-message-user" : "pichat-message-ai"}`, children: [
    /* @__PURE__ */ t("div", { class: "pichat-message-header", children: [
      m ? /* @__PURE__ */ t("div", { class: "pichat-avatar pichat-avatar-user", children: c }) : /* @__PURE__ */ t("div", { class: "pichat-avatar pichat-avatar-ai pichat-icon-assistant" }),
      /* @__PURE__ */ t("div", { class: "pichat-message-sender-wrapper", children: [
        /* @__PURE__ */ t("span", { class: "pichat-message-sender", children: s }),
        !m && l && /* @__PURE__ */ t("div", { class: "pichat-message-status", children: [
          l,
          /* @__PURE__ */ t("span", { class: "pichat-status-dots" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { class: "pichat-message-content", children: [
      /* @__PURE__ */ t("div", { class: "pichat-message-text", dangerouslySetInnerHTML: { __html: Te(a) } }),
      d && /* @__PURE__ */ t("span", { class: "pichat-streaming-cursor", children: "▊" }),
      /* @__PURE__ */ t(Ie, { links: o })
    ] }),
    !m && r && r.length > 0 && /* @__PURE__ */ t(Ce, { children: r.map(
      (k) => me(k, {
        messages: i,
        currentMessage: y,
        ...k.props
      })
    ) })
  ] });
}
function $e({ messages: n, buttons: e, scrollRef: s, spacerRef: c }) {
  return /* @__PURE__ */ t("div", { class: "pichat-message-list-wrapper", ref: s, children: [
    /* @__PURE__ */ t("div", { class: "pichat-message-list", children: n.map((a) => {
      const o = typeof e == "function" ? e(a) : e;
      return /* @__PURE__ */ t(_e, { ...a, buttons: o, messages: n }, a.id);
    }) }),
    /* @__PURE__ */ t("div", { ref: c, class: "pichat-message-spacer" })
  ] });
}
const ue = le(
  ({
    value: n,
    onChange: e,
    onSend: s,
    isGenerating: c = !1,
    onStopGeneration: a,
    placeholder: o = "Type a message",
    sendButtonAriaLabel: d = "Send message",
    stopButtonAriaLabel: l = "Stop generation",
    additionalButtons: r
  }, i) => /* @__PURE__ */ t("div", { class: "pichat-input-container", children: /* @__PURE__ */ t("div", { class: "pichat-input-wrapper", children: [
    /* @__PURE__ */ t(
      "input",
      {
        ref: i,
        type: "text",
        class: "pichat-input",
        placeholder: c ? "AI is typing..." : o,
        value: n,
        onInput: (y) => e(y.target.value),
        onKeyDown: (y) => {
          y.key === "Enter" && !y.shiftKey && !c && (y.preventDefault(), s(), i && i.current && i.current.focus());
        }
      }
    ),
    c ? /* @__PURE__ */ t(
      "button",
      {
        class: "pichat-send-button pichat-action-icon pichat-icon-stop",
        onClick: a,
        "aria-label": l
      }
    ) : /* @__PURE__ */ t(
      "button",
      {
        class: "pichat-send-button pichat-action-icon pichat-icon-send",
        onClick: s,
        disabled: !n.trim(),
        "aria-label": d
      }
    ),
    r
  ] }) })
), de = se(null);
function xe() {
  const n = ae(de);
  if (!n)
    throw new Error("useAppContext must be used within an AppContextProvider");
  return n;
}
function Ae({ initialContext: n = {}, children: e }) {
  const [s, c] = $(n), a = (r) => {
    c((i) => ({
      ...i,
      ...r
    }));
  }, o = (r, i) => {
    c((m) => ({
      ...m,
      [r]: i
    }));
  }, d = () => {
    c(n);
  };
  G(() => (typeof window < "u" && (window.chatAppContext = {
    get: () => s,
    update: a,
    set: o,
    clear: d
  }), () => {
    typeof window < "u" && delete window.chatAppContext;
  }), [s]);
  const l = {
    context: s,
    updateContext: a,
    setContextValue: o,
    clearContext: d
  };
  return /* @__PURE__ */ t(de.Provider, { value: l, children: e });
}
const he = se(null);
function V() {
  const n = ae(he);
  if (!n)
    throw new Error("useChat must be used within a ChatProvider");
  return n;
}
function De({
  endpoint: n,
  initialMessage: e,
  streamInitialMessage: s = !0,
  onSendMessage: c,
  onThumbUp: a,
  onThumbDown: o,
  children: d,
  theme: l,
  webComponentProps: r
}) {
  const i = n || void 0 || "/pichat", { context: m } = xe(), y = (u, f) => {
    if (!(!u || !f))
      return f.split(".").reduce((p, S) => p != null && typeof p == "object" && S in p ? p[S] : void 0, u);
  }, k = (u, f) => typeof u != "string" ? u : u.replace(/\$\{([^}]+)\}/g, (p, S) => {
    const T = y(f, S.trim());
    return T != null ? String(T) : "";
  }), A = {
    id: "1",
    sender: "ai",
    name: (r == null ? void 0 : r.chatbotName) || (l == null ? void 0 : l.chatbotName) || "Assistant",
    content: (r == null ? void 0 : r.initialMessage) || (l == null ? void 0 : l.initialMessage) || "Hello! 👋 Welcome! I'm here to assist you with any questions or tasks you might have. Whether you need help with technical queries, general information, or just want to explore what I can do - I'm ready to help! How can I make your day better today? 😊",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, [B, h] = $(() => {
    const u = e || A;
    return [{
      ...u,
      content: k(u.content, m)
    }];
  }), [E, D] = $(!1), [I, w] = $(!1), [v, F] = $(null);
  G(() => {
    (async () => {
      try {
        const f = await fetch(`${i}/api/welcome`);
        if (f.ok) {
          const p = await f.json();
          if (!e) {
            const S = {
              ...p,
              content: k(p.content, m)
            };
            h([S]);
          }
          D(!0);
        }
      } catch {
        console.log("Mock server not available, using default welcome message"), D(!1);
      }
    })();
  }, []);
  const [O, C] = $(""), [U, L] = $({}), J = c || (async (u) => {
    const f = {
      id: Date.now().toString(),
      sender: "user",
      name: "Mike",
      avatar: "MZ",
      content: u,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    h((p) => [...p, f]), w(!0);
    try {
      const p = await fetch(`${i}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: u })
      });
      if (!p.ok)
        throw new Error(`Server responded with ${p.status}`);
      const S = p.body.getReader();
      F(S);
      const T = new TextDecoder();
      let _ = "", g = null;
      for (; ; ) {
        const { done: R, value: q } = await S.read();
        if (R) break;
        _ += T.decode(q, { stream: !0 });
        const ce = _.split(`
`);
        _ = ce.pop();
        for (const ie of ce)
          if (ie.startsWith("data: "))
            try {
              const b = JSON.parse(ie.slice(6));
              if ("content" in b && "meta" in b) {
                if (b.start === !0 && b.meta.message_id) {
                  g = b.meta.message_id;
                  const W = {
                    id: g,
                    sender: "ai",
                    name: (r == null ? void 0 : r.chatbotName) || (l == null ? void 0 : l.chatbotName) || "Assistant",
                    content: "",
                    status: "",
                    timestamp: b.meta.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
                    isStreaming: !0
                  };
                  h((M) => [...M, W]);
                } else b.meta && b.meta.status && g ? h(
                  (W) => W.map((M) => M.id === g ? { ...M, status: b.meta.status } : M)
                ) : b.content && g && h(
                  (W) => W.map(
                    (M) => M.id === g ? { ...M, content: M.content + b.content, status: "" } : M
                  )
                );
                b.finish_reason === "stop" && g && (h(
                  (W) => W.map((M) => M.id === g ? { ...M, isStreaming: !1, status: "" } : M)
                ), w(!1));
              } else
                switch (b.type) {
                  // Anthropic format
                  case "message_start":
                    g = b.message.id;
                    const W = {
                      id: g,
                      sender: "ai",
                      name: (r == null ? void 0 : r.chatbotName) || (l == null ? void 0 : l.chatbotName) || "Assistant",
                      content: "",
                      status: "",
                      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                      isStreaming: !0
                    };
                    h((H) => [...H, W]);
                    break;
                  case "content_block_delta":
                    g && b.delta && b.delta.type === "text_delta" && h(
                      (H) => H.map(
                        (x) => x.id === g ? { ...x, content: x.content + b.delta.text, status: "" } : x
                      )
                    );
                    break;
                  case "message_stop":
                    g && (h(
                      (H) => H.map((x) => x.id === g ? { ...x, isStreaming: !1, status: "" } : x)
                    ), w(!1));
                    break;
                  // Original simple format
                  case "start":
                    g = b.id;
                    const M = {
                      id: g,
                      sender: b.sender,
                      name: b.name,
                      content: "",
                      status: "",
                      timestamp: b.timestamp,
                      isStreaming: !0
                    };
                    h((H) => [...H, M]);
                    break;
                  case "status":
                    g && h(
                      (H) => H.map((x) => x.id === g ? { ...x, status: b.content } : x)
                    );
                    break;
                  case "chunk":
                    if (g) {
                      const H = b.delta || b.content || "";
                      h(
                        (x) => x.map(
                          (P) => P.id === g ? { ...P, content: P.content + H, status: "" } : P
                        )
                      );
                    }
                    break;
                  case "complete":
                    g && (h(
                      (H) => H.map((x) => x.id === g ? { ...x, isStreaming: !1, status: "" } : x)
                    ), w(!1));
                    break;
                }
            } catch (b) {
              console.error("Failed to parse SSE data:", b);
            }
      }
    } catch (p) {
      p.name !== "AbortError" && console.error("Failed to get AI response:", p), w(!1);
      const S = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        name: (r == null ? void 0 : r.chatbotName) || (l == null ? void 0 : l.chatbotName) || "Assistant",
        content: `I apologize, but I'm having trouble connecting to the server right now. Please try again in a moment. (Error: ${p.message})`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        isError: !0
      };
      h((T) => [...T, S]);
    }
  }), Z = () => {
    O.trim() && (J(O), C(""));
  }, Q = () => {
    if (v)
      try {
        v.cancel(), F(null);
      } catch (u) {
        console.error("Error canceling stream:", u);
      }
    h((u) => u.map((f) => f.isStreaming ? { ...f, isStreaming: !1 } : f)), w(!1);
  }, Y = async (u) => {
    try {
      return await navigator.clipboard.writeText(u), console.log("Message copied to clipboard"), !0;
    } catch (f) {
      return console.error("Failed to copy message:", f), !1;
    }
  }, K = async (u, f) => {
    const p = `feedback_${u}`, S = U[u];
    let T = null;
    if (S !== "thumbs_up") {
      if (T = "thumbs_up", a)
        try {
          await a(u, f);
        } catch (_) {
          console.error("Failed to handle thumb up:", _);
        }
      else
        try {
          await fetch(`${i}/api/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messageId: u,
              content: f,
              type: "thumbs_up",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            })
          });
        } catch (_) {
          console.error("Failed to send feedback:", _);
        }
      localStorage.setItem(
        p,
        JSON.stringify({
          type: "thumbs_up",
          messageId: u,
          content: f,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
    } else
      localStorage.removeItem(p);
    return L((_) => ({
      ..._,
      [u]: T
    })), { messageId: u, type: T };
  }, j = async (u, f) => {
    const p = `feedback_${u}`, S = U[u];
    let T = null;
    if (S !== "thumbs_down") {
      if (T = "thumbs_down", o)
        try {
          await o(u, f);
        } catch (_) {
          console.error("Failed to handle thumb down:", _);
        }
      else
        try {
          await fetch(`${i}/api/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messageId: u,
              content: f,
              type: "thumbs_down",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            })
          });
        } catch (_) {
          console.error("Failed to send feedback:", _);
        }
      localStorage.setItem(
        p,
        JSON.stringify({
          type: "thumbs_down",
          messageId: u,
          content: f,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
    } else
      localStorage.removeItem(p);
    return L((_) => ({
      ..._,
      [u]: T
    })), { messageId: u, type: T };
  }, N = (u) => U[u] || null, te = (u) => {
    console.log("Opening feedback with messages:", u), alert("Thank you for your interest in helping us improve! Feedback form coming soon.");
  };
  G(() => {
    const u = {};
    for (let f = 0; f < localStorage.length; f++) {
      const p = localStorage.key(f);
      if (p != null && p.startsWith("feedback_")) {
        const S = p.replace("feedback_", ""), T = JSON.parse(localStorage.getItem(p));
        u[S] = T.type;
      }
    }
    L(u);
  }, []);
  const ne = {
    // State
    messages: B,
    setMessages: h,
    inputValue: O,
    setInputValue: C,
    isConnected: E,
    isGenerating: I,
    // Message operations
    copyMessage: Y,
    toggleThumbsUp: K,
    toggleThumbsDown: j,
    getFeedbackType: N,
    openFeedback: te,
    // Handlers
    handleSendMessage: J,
    handleSend: Z,
    stopGeneration: Q,
    /**
     * Start a new chat - show initial message with optional streaming effect
     */
    startNewChat: () => {
      console.log("Starting new chat...");
      const u = {
        ...e || A,
        id: Date.now().toString(),
        // New ID for the fresh message
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (C(""), s) {
        const f = k(u.content, m);
        h([
          {
            ...u,
            content: "",
            isStreaming: !0
          }
        ]);
        let p = 0;
        const S = f.split(" ");
        let T = "";
        const _ = setInterval(() => {
          p < S.length ? (T += (p > 0 ? " " : "") + S[p], p++, h([
            {
              ...u,
              content: T,
              isStreaming: p < S.length
            }
          ])) : clearInterval(_);
        }, 50);
      } else
        h([
          {
            ...u,
            content: k(u.content, m)
          }
        ]);
    }
  };
  return /* @__PURE__ */ t(he.Provider, { value: ne, children: d });
}
const pe = se({
  openScreen: () => {
  },
  closeScreen: () => {
  },
  closePopup: () => {
  },
  activeScreen: null
});
function fe() {
  const n = ae(pe);
  return n || (console.warn("useScreen must be used within a ScreenContext.Provider"), {
    openScreen: () => {
    },
    closeScreen: () => {
    },
    closePopup: () => {
    },
    activeScreen: null
  });
}
le((n, e) => {
  const { handleSendMessage: s } = V(), { openScreen: c } = fe();
  return /* @__PURE__ */ t(ue, { ...n, ref: e });
});
function ge({
  iconClass: n,
  inProgressIconClass: e,
  endIconClass: s,
  onClick: c,
  title: a,
  label: o,
  className: d = "",
  isActive: l = !1,
  tooltipText: r,
  tooltipDuration: i = 2e3,
  baseClass: m = "pichat-button",
  additionalClasses: y = []
}) {
  const [k, A] = $(!1), [B, h] = $(n), E = () => {
    if (c) {
      e && h(e);
      const v = c();
      v && typeof v.then == "function" ? v.then(() => {
        D();
      }).catch(() => {
        h(n);
      }) : D();
    }
  }, D = () => {
    s && h(s), r && i > 0 && A(!0);
    const v = i > 0 ? i : 500;
    setTimeout(() => {
      A(!1), h(n);
    }, v);
  }, I = [m, ...y, l ? "pichat-active" : "", d].filter(Boolean).join(" "), w = /* @__PURE__ */ t("button", { class: `${I} ${B}`, onClick: E, title: a, "aria-label": a, children: o && /* @__PURE__ */ t("span", { class: "pichat-button-label", children: o }) });
  return /* @__PURE__ */ t("div", { class: "pichat-button-wrapper", children: [
    w,
    k && r && /* @__PURE__ */ t("span", { class: "pichat-tooltip pichat-tooltip-top", children: r })
  ] });
}
function ee(n) {
  return /* @__PURE__ */ t(ge, { ...n, additionalClasses: ["pichat-chat-button"] });
}
function Fe({
  onClick: n,
  title: e = "Start a new conversation",
  label: s = "Start new chat",
  iconClass: c = "pichat-icon-plus"
}) {
  const { startNewChat: a } = V();
  return /* @__PURE__ */ t(ee, { iconClass: c, onClick: () => {
    n ? n() : a();
  }, title: e, label: s, className: "pichat-new-chat" });
}
function Me({
  onClick: n,
  title: e = "AI Disclaimer",
  label: s = "AI can make mistakes",
  iconClass: c = "pichat-icon-info",
  disclaimerText: a = "This AI assistant can make mistakes. Please verify important information and use your own judgment when making decisions."
}) {
  return /* @__PURE__ */ t(ee, { iconClass: c, onClick: () => {
    n ? n() : alert(a);
  }, title: e, label: s, className: "pichat-disclaimer" });
}
function Oe({ leftElement: n, rightElement: e }) {
  const { openScreen: s } = fe();
  return /* @__PURE__ */ t("div", { class: "pichat-input-footer", children: [
    n || /* @__PURE__ */ t(Fe, {}),
    e || /* @__PURE__ */ t(Me, { onClick: () => s("legal-disclaimer") })
  ] });
}
function Be({ screens: n = [], onClosePopup: e, messages: s, setMessages: c, children: a }) {
  const [o, d] = $(null), l = (y, k = {}) => {
    const A = n.find((B) => B.id === y);
    A ? d({ ...A, props: k }) : console.warn(`Screen with id "${y}" not found`);
  }, r = () => {
    d(null);
  }, i = () => {
    e && e();
  }, m = {
    openScreen: l,
    closeScreen: r,
    closePopup: i,
    activeScreen: o
  };
  return /* @__PURE__ */ t(pe.Provider, { value: m, children: [
    a,
    o && /* @__PURE__ */ t(ye, { fallback: /* @__PURE__ */ t("div", { class: "pichat-screen-loading", children: "Loading..." }), children: /* @__PURE__ */ t(
      o.component,
      {
        onClose: r,
        onClosePopup: i,
        messages: s,
        setMessages: c,
        ...o.props
      }
    ) })
  ] });
}
function He({ title: n, onClose: e, onClosePopup: s, children: c, footer: a, className: o = "" }) {
  return /* @__PURE__ */ t("div", { class: `pichat-screen ${o}`, children: [
    n && /* @__PURE__ */ t("div", { class: "pichat-screen-header", children: [
      /* @__PURE__ */ t(
        "button",
        {
          class: "pichat-icon-button pichat-icon-back",
          onClick: e,
          "aria-label": "Go back",
          title: "Go back"
        }
      ),
      /* @__PURE__ */ t("h3", { class: "pichat-screen-title", children: n }),
      s && /* @__PURE__ */ t(
        "button",
        {
          class: "pichat-icon-button pichat-icon-close",
          onClick: s,
          "aria-label": "Close chat",
          title: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ t("div", { class: "pichat-screen-content", children: c }),
    a && /* @__PURE__ */ t("div", { class: "pichat-screen-footer", children: a })
  ] });
}
function re({
  onClose: n,
  onClosePopup: e,
  onDecline: s,
  disclaimerText: c = `
    <p>The AI navigator tool is a tool that uses artificial intelligence. It may contain errors or inaccuracies and is intended to provide general information. While we strive to deliver accurate and reliable content, it may not always reflect the latest developments or expert opinions. It does not overrule or supersede any product-specific Documentation and/or professional advice.</p>
    <p>When you use this tool, we automatically collect information about you, including:</p>
    <ul>
    <li>Conversation log</li>
    <li>Information collected by cookies and other tracking technologies.</li>
    </ul>
    <p>We use the information to provide, maintain and improve our services and responses for marketing purposes. It should not be used for any other purpose. The information will be protected as established in our data privacy policy. Timeline of keeping information is 90 days.</p>`,
  declineButtonText: a = "Decline",
  acceptButtonText: o = "Accept"
}) {
  const d = () => {
    s ? s() : n();
  }, l = () => {
    n();
  };
  return /* @__PURE__ */ t(He, { title: "AI Disclaimer", onClose: l, onClosePopup: e, footer: /* @__PURE__ */ t("div", { class: "pichat-screen-buttons", children: [
    /* @__PURE__ */ t(ee, { variant: "negative", label: a, onClick: d }),
    /* @__PURE__ */ t(ee, { variant: "primary", label: o, onClick: l })
  ] }), className: "pichat-legal-disclaimer-screen", children: /* @__PURE__ */ t("div", { class: "pichat-screen-text", dangerouslySetInnerHTML: { __html: c } }) });
}
function Ne(n, e, s = !0, c = null) {
  var l;
  const a = z(n.length), o = z((l = n[0]) == null ? void 0 : l.id), d = z(!1);
  be(() => {
    var h, E;
    if (!e.current) return;
    const r = e.current, i = r.querySelector(".pichat-message-list");
    if (!i) return;
    const m = n.length < a.current || ((h = n[0]) == null ? void 0 : h.id) !== o.current && o.current !== void 0;
    (E = n[0]) != null && E.id && (o.current = n[0].id);
    const y = n[n.length - 1], k = (y == null ? void 0 : y.isStreaming) || !1, A = n.length > a.current && (y == null ? void 0 : y.sender) === "user", B = d.current && !k;
    if (s && A) {
      const D = r.clientHeight;
      if (c && c.current) {
        const I = c.current;
        I.style.height = `${D}px`, console.log("User message sent - spacer set to full height:", D), setTimeout(() => {
          const v = r.querySelectorAll(".pichat-message")[n.length - 1];
          if (v) {
            const F = parseInt(window.getComputedStyle(i).paddingTop) || 0, O = v.offsetTop - F;
            console.log("Auto-scroll to user message:", {
              targetOffset: v.offsetTop,
              paddingTop: F,
              calculatedPosition: O
            }), r.scrollTo({
              top: O,
              behavior: "smooth"
            });
          }
        }, 500);
      }
    }
    if (s && B && c && c.current) {
      const D = r.clientHeight, I = r.querySelectorAll(".pichat-message");
      let w = -1;
      for (let v = I.length - 1; v >= 0; v--) {
        const F = n[v];
        if (F && F.sender === "user") {
          w = v;
          break;
        }
      }
      if (w >= 0 && I[w]) {
        const v = I[w], F = parseInt(window.getComputedStyle(i).paddingTop) || 0, O = i.scrollHeight - v.offsetTop + F, C = Math.max(0, D - O);
        c.current.style.height = `${C}px`, console.log("Streaming ended - spacer adjusted:", {
          containerHeight: D,
          lastUserMessageOffset: v.offsetTop,
          heightFromUserMessageToEnd: O,
          spacerHeight: C
        });
      }
    }
    if (!s && c && c.current && (parseInt(c.current.style.height) || 0) !== 0 && (c.current.style.height = "0"), d.current = k, m && s) {
      console.log("Chat reset detected, scrolling to top"), setTimeout(() => {
        r.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 50), a.current = n.length;
      return;
    }
    a.current = n.length;
  }, [n, s]);
}
function oe(n) {
  return /* @__PURE__ */ t(ge, { ...n, additionalClasses: ["pichat-message-button", "pichat-message-action-icon"] });
}
function Ee({
  messages: n,
  currentMessage: e,
  onClick: s,
  title: c = "Copy message",
  tooltipText: a = "Copied!",
  tooltipDuration: o = 2e3
}) {
  const { copyMessage: d } = V();
  return /* @__PURE__ */ t(
    oe,
    {
      iconClass: "pichat-icon-copy",
      endIconClass: "pichat-icon-check",
      onClick: async () => {
        if (d && e) {
          const r = await d(e.content);
          s && s(e.content, r);
        }
      },
      title: c,
      tooltipText: a,
      tooltipDuration: o
    }
  );
}
function Le({ messages: n, currentMessage: e, onClick: s, title: c = "Good response" }) {
  const { toggleThumbsUp: a, getFeedbackType: o } = V(), [d, l] = $(!1);
  return G(() => {
    if (o && e) {
      const i = o(e.id);
      l(i === "thumbs_up");
    }
  }, [o, e]), /* @__PURE__ */ t(oe, { iconClass: "pichat-icon-thumbs-up", onClick: async () => {
    if (console.log("ThumbsUp clicked", { currentMessage: e }), a && e) {
      const i = await a(e.id, e.content);
      console.log("Toggle result:", i), l(i.type === "thumbs_up"), s && s(i);
    } else
      console.warn("Missing requirements for toggle:", {
        hasToggleMethod: !!a,
        hasCurrentMessage: !!e,
        currentMessageId: e == null ? void 0 : e.id
      });
  }, title: c, isActive: d });
}
function We({ messages: n, currentMessage: e, onClick: s, title: c = "Bad response" }) {
  const { toggleThumbsDown: a, getFeedbackType: o } = V(), [d, l] = $(!1);
  return G(() => {
    if (o && e) {
      const i = o(e.id);
      l(i === "thumbs_down");
    }
  }, [o, e]), /* @__PURE__ */ t(oe, { iconClass: "pichat-icon-thumbs-down", onClick: async () => {
    if (console.log("ThumbsDown clicked", { currentMessage: e }), a && e) {
      const i = await a(e.id, e.content);
      console.log("Toggle result:", i), l(i.type === "thumbs_down"), s && s(i);
    } else
      console.warn("Missing requirements for toggle:", {
        hasToggleMethod: !!a,
        hasCurrentMessage: !!e,
        currentMessageId: e == null ? void 0 : e.id
      });
  }, title: c, isActive: d });
}
function Ue({ children: n, messageId: e, content: s, onActiveChange: c, mode: a = "hideOthers", ...o }) {
  const [d, l] = $(null), r = (i, m) => (y) => {
    const k = d === i, A = k ? null : i;
    if (l(A), c && c({
      previousIndex: d,
      currentIndex: A,
      wasActive: k
    }), m)
      return m(y);
  };
  return /* @__PURE__ */ t(Se, { children: n.map((i, m) => {
    if (a === "hideOthers" && d !== null && d !== m)
      return null;
    const y = {
      ...i.props,
      ...o,
      // Pass through all other props (like controller, currentMessage, etc.)
      key: i.key || m,
      messageId: e,
      content: s,
      onClick: r(m, i.props.onClick)
    };
    return i.props.isActive === void 0 && (y.isActive = d === m), ve(i, y);
  }) });
}
function je({
  Header: n,
  MessageList: e,
  Input: s,
  Footer: c,
  theme: a,
  screens: o,
  messageButtons: d,
  autoScroll: l = !0,
  title: r = "Chat with Assistant",
  showCopyButton: i = !0,
  showFeedbackButtons: m = !0,
  placeholder: y = "Type a message",
  positionClass: k = "pichat-popup__bottom-popup",
  popupHidden: A = !0,
  setPopupHidden: B,
  webComponentProps: h
}) {
  const E = z(null), D = z(null), I = z(null), { messages: w, inputValue: v, setInputValue: F, handleSend: O, isGenerating: C, stopGeneration: U } = V();
  G(() => {
    !C && I.current && document.activeElement !== I.current && setTimeout(() => {
      I.current && typeof I.current.focus == "function" && I.current.focus();
    }, 50);
  }, [C, w]);
  const L = [];
  i && L.push(/* @__PURE__ */ t(Ee, {}, "copy")), m && L.push(
    /* @__PURE__ */ t(Ue, { children: [
      /* @__PURE__ */ t(Le, {}),
      /* @__PURE__ */ t(We, {})
    ] }, "feedback")
  );
  const X = d || L;
  Ne(w, E, l, D);
  const J = n || /* @__PURE__ */ t(
    we,
    {
      title: (h == null ? void 0 : h.title) || (a == null ? void 0 : a.title) || r,
      showBackButton: !1,
      theme: a,
      closeButtonAction: () => B(!0)
    }
  ), Z = e || /* @__PURE__ */ t($e, { scrollRef: E, spacerRef: D, messages: w, buttons: X }), Q = s ? /* @__PURE__ */ t(
    s,
    {
      ref: I,
      value: v,
      onChange: F,
      onSend: O,
      isGenerating: C,
      onStopGeneration: U,
      placeholder: (h == null ? void 0 : h.placeholderText) || (a == null ? void 0 : a.placeholderText) || y
    }
  ) : /* @__PURE__ */ t(
    ue,
    {
      ref: I,
      value: v,
      onChange: F,
      onSend: O,
      isGenerating: C,
      onStopGeneration: U,
      placeholder: (h == null ? void 0 : h.placeholderText) || (a == null ? void 0 : a.placeholderText) || y
    }
  ), K = (o || [
    {
      id: "legal-disclaimer",
      component: re
    }
  ]).map((j) => j.id === "legal-disclaimer" ? {
    ...j,
    component: (N) => /* @__PURE__ */ t(re, { ...N, onDecline: () => B(!0) })
  } : j);
  return /* @__PURE__ */ t(
    "div",
    {
      class: `pichat-popup ${A ? "pichat-popup__hidden" : ""} ${k}`,
      children: /* @__PURE__ */ t(
        Be,
        {
          screens: K,
          onClosePopup: () => B(!0),
          messages: w,
          setMessages: V().setMessages,
          children: /* @__PURE__ */ t("div", { class: "pichat-popup-wrapper", children: [
            J,
            /* @__PURE__ */ t("div", { class: "pichat-popup-content", children: [
              Z,
              Q,
              c || /* @__PURE__ */ t(Oe, {})
            ] })
          ] })
        }
      )
    }
  );
}
function Ge({
  title: n = "Chat with Assistant",
  icon: e = "pichat-icon-assistant",
  popupHidden: s,
  setPopupHidden: c,
  theme: a,
  webComponentProps: o
}) {
  return /* @__PURE__ */ t("div", { class: "pichat-popup-button", onClick: () => {
    c(!1);
  }, children: [
    /* @__PURE__ */ t("span", { class: `pichat-popup-button-icon ${e}` }),
    /* @__PURE__ */ t("span", { class: "pichat-popup-button-title", children: (o == null ? void 0 : o.popupButtonText) || (a == null ? void 0 : a.popupButtonText) || n })
  ] });
}
function qe(n, e = {}) {
  const [s, c] = $(e), [a, o] = $(!!n), [d, l] = $(null);
  return G(() => {
    if (!n) {
      o(!1);
      return;
    }
    (async () => {
      try {
        o(!0), l(null);
        const i = await fetch(n);
        if (!i.ok)
          throw new Error(`Failed to fetch config: ${i.status} ${i.statusText}`);
        const m = await i.json();
        c({ ...e, ...m }), o(!1);
      } catch (i) {
        console.error("Error fetching config:", i), l(i), o(!1);
      }
    })();
  }, [n]), { config: s, loading: a, error: d };
}
function Ve({
  // Config
  configEndpoint: n,
  // Chat provider props
  endpoint: e,
  initialMessage: s,
  streamInitialMessage: c,
  onSendMessage: a,
  onThumbUp: o,
  onThumbDown: d,
  // App context
  initialContext: l,
  allowExternalUpdates: r = !0,
  // UI component overrides (JSX - not from config)
  Header: i,
  MessageList: m,
  Input: y,
  Footer: k,
  // UI configuration props (can be overridden or come from config)
  messageButtons: A,
  autoScroll: B = !0,
  title: h,
  showThemeToggle: E,
  showCopyButton: D,
  showFeedbackButtons: I,
  placeholder: w,
  popupHiddenOnLoad: v,
  // Web component props
  webComponentProps: F,
  // Additional popup props
  ...O
}) {
  const { config: C } = qe(n, {}), U = C.title ?? h ?? "Chat with Assistant";
  C.showThemeToggle;
  const L = C.showCopyButton ?? D ?? !0, X = C.showFeedbackButtons ?? I ?? !0, J = C.placeholder ?? w ?? "Type a message", Z = C.popupHiddenOnLoad ?? v ?? !0, Q = C.streamInitialMessage ?? c ?? !0, Y = C.initialMessage ?? s, [K, j] = $(Z), [N, te] = $(null), [ne, u] = $(!1), f = async () => {
    try {
      const g = new URLSearchParams(window.location.search).get("testChatbotPath"), R = await fetch(`/bin/pichat/config?path=${g || window.location.pathname}`);
      if (R.ok) {
        const q = await R.json();
        console.log("data", q), q.success ? te(q.theme) : console.warn("Failed to load configuration");
      } else
        console.warn("Failed to load configuration");
    } catch (g) {
      console.warn("Error loading configuration:", g);
    } finally {
      console.log("Themes loaded"), u(!0);
    }
  };
  G(() => {
    console.log("Loading themes", N), f();
  }, []);
  const p = {
    endpoint: e,
    initialMessage: Y,
    streamInitialMessage: Q,
    onSendMessage: a,
    onThumbUp: o,
    onThumbDown: d,
    theme: N,
    webComponentProps: F
  }, S = {
    Header: i,
    MessageList: m,
    Input: y,
    Footer: k,
    messageButtons: A,
    autoScroll: B,
    title: U,
    showCopyButton: L,
    showFeedbackButtons: X,
    placeholder: J,
    popupHidden: K,
    setPopupHidden: j,
    theme: N,
    webComponentProps: F,
    ...O
  }, T = {
    title: "Chat with Assistant",
    icon: "pichat-icon-assistant",
    popupHidden: K,
    setPopupHidden: j,
    theme: N,
    webComponentProps: F
  }, _ = (g) => g.replace(/([A-Z])/g, "-$1").toLowerCase();
  return ne ? (console.log("Themes loaded - rendering", N), /* @__PURE__ */ t(
    "div",
    {
      style: {
        ...Object.entries(N || {}).filter(([g]) => g.endsWith("Css")).reduce((g, [R, q]) => (g[`--${_(R.replace("Css", ""))}`] = q, g), {})
      },
      children: /* @__PURE__ */ t(Ae, { initialContext: l, allowExternalUpdates: r, children: /* @__PURE__ */ t(De, { ...p, children: [
        /* @__PURE__ */ t(je, { ...S }),
        /* @__PURE__ */ t(Ge, { ...T })
      ] }) })
    }
  )) : (console.log("Themes not loaded", N), null);
}
class Je extends HTMLElement {
  constructor() {
    super(), console.log("ChatbotComponent constructor 2");
  }
  kebabToCamel(e) {
    return e.replace(/-([a-z])/g, (s, c) => c.toUpperCase());
  }
  connectedCallback() {
    const e = this.attachShadow({ mode: "open" }), s = document.createElement("div");
    s.id = "pichat-chatbot-root";
    const c = document.createElement("div"), a = {};
    for (let o = 0; o < this.attributes.length; o++) {
      const d = this.attributes[o];
      a[this.kebabToCamel(d.name)] = d.value;
    }
    console.log("ChatbotComponent connectedCallback props", a), c.innerHTML = `
      <link
        rel="stylesheet"
        href="/etc.clientlibs/pichat/clientlibs/clientlib-shared.css"
      />
      <link
        rel="stylesheet"
        href="/etc.clientlibs/pichat/clientlibs/clientlib-chatbot.css"
      />`, e.appendChild(c), e.appendChild(s), ke(/* @__PURE__ */ t(Ve, { webComponentProps: a }), s);
  }
}
customElements.define("pichat-chatbot", Je);
export {
  Ve as ChatApp
};
