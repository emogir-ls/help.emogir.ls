import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { MdDragIndicator } from "react-icons/md";
import { MoveUpRight } from "lucide-react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Button from "@site/src/components/Button";
import styles from "./styles.module.css";

export default function ChatBot() {
  const { siteConfig } = useDocusaurusContext();
  const API_URL = siteConfig.customFields?.API_URL || "";
  const FRONTEND_URL = siteConfig.customFields?.FRONTEND_URL || "";

  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(null);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const [position, setPosition] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, startX: 0 });
  const animationFrameRef = useRef(null);
  const [pendingConfirmations, setPendingConfirmations] = useState(new Map());

  const verifyTokens = async () => {
    const token = localStorage.getItem("helpdeskToken");
    const refreshToken = localStorage.getItem("helpdeskRefreshToken");

    if (!token) {
      return { valid: false };
    }

    if (!API_URL) {
      console.error("API_URL is not configured");
      return { valid: false };
    }

    try {
      const response = await fetch(`${API_URL}/auth/helpdesk/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          refreshToken: refreshToken || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { valid: false, error: error.error || "Token verification failed" };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      return { valid: false, error: "Network error" };
    }
  };

  const extractTokensFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refresh");

    if (token && refreshToken) {
      localStorage.setItem("helpdeskToken", token);
      localStorage.setItem("helpdeskRefreshToken", refreshToken);
      window.location.href = "/";
      return true;
    }
    return false;
  };

  const redirectToLogin = () => {
    if (!FRONTEND_URL) {
      console.error("FRONTEND_URL is not configured");
      return;
    }
    window.location.href = `${FRONTEND_URL}/auth/helpdesk/login`;
  };

  const handleTokenExpired = () => {
    localStorage.removeItem("helpdeskToken");
    localStorage.removeItem("helpdeskRefreshToken");
    redirectToLogin();
  };

  const sendChatMessage = async (message) => {
    const token = localStorage.getItem("helpdeskToken");

    if (!token) {
      throw new Error("No helpdesk token available");
    }

    if (!API_URL) {
      throw new Error("API_URL is not configured");
    }

    if (message.length > 2000) {
      throw new Error("Message is too long (max 2000 characters)");
    }

    try {
      const response = await fetch(`${API_URL}/helpdesk/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.status === 401) {
        handleTokenExpired();
        throw new Error("Token expired");
      }

      if (response.status === 429) {
        const error = await response.json();
        const resetAt = response.headers.get("X-RateLimit-Reset");
        setRateLimitReset(resetAt);
        throw new Error(`Rate limited: ${error.error || "Too many requests"}`);
      }

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending || !isAuthenticated) return;

    const userMessage = input.trim();
    const tempInput = input;
    setInput("");
    
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    }, 50);
    
    setIsSending(true);
    setRateLimited(false);
    setRateLimitReset(null);

    try {
      const response = await sendChatMessage(userMessage);
      
      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev, { role: "assistant", content: response.message || response }];
          
          if (response.requiresConfirmation) {
            const messageIndex = newMessages.length - 1;
            setPendingConfirmations((prevConfirmations) => {
              const newMap = new Map(prevConfirmations);
              newMap.set(messageIndex, response.confirmationData || null);
              return newMap;
            });
          }
          
          return newMessages;
        });
      }, 100);
    } catch (error) {
      if (error.message?.includes("Rate limited")) {
        setRateLimited(true);
      } else if (error.message?.includes("Token expired")) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
        }, 100);
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    extractTokensFromUrl();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  const handleMouseDown = (e) => {
    const moveButton = e.target.closest(`.${styles.chatMoveButton}`);
    const header = e.target.closest(`.${styles.chatHeader}`);
    const closeButton = e.target.closest(`.${styles.chatCloseButton}`);
    
    if (closeButton) {
      return;
    }
    
    if (moveButton || header) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        startX: position.x,
      };
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          const deltaX = e.clientX - dragStartRef.current.x;
          const chatWidth = chatWindowRef.current?.offsetWidth || 384;
          const spacing = 16;
          const maxLeft = -(window.innerWidth - chatWidth - spacing);
          const newX = Math.max(maxLeft, Math.min(0, dragStartRef.current.startX + deltaX));
          setPosition({ x: newX });
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging]);

  const checkAuthentication = async () => {
    setIsLoading(true);
    setAuthError(null);
    const result = await verifyTokens();

    if (result.valid && result.user) {
      setIsAuthenticated(true);
      setUser(result.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      if (result.error) {
        setAuthError(result.error);
        if (result.error === "User is banned") {
          handleTokenExpired();
        }
      }
    }
    setIsLoading(false);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      checkAuthentication();
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const renderMessageWithColorBlocks = (content) => {
    const colorRegex = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = colorRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const colorCode = match[0];
      parts.push(
        <span key={match.index} className={styles.colorCodeWrapper}>
          <span className={styles.colorCode}>{colorCode}</span>
          <span 
            className={styles.colorBlock} 
            style={{ backgroundColor: colorCode }}
            title={colorCode}
          />
        </span>
      );
      
      lastIndex = match.index + colorCode.length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  const renderInlineMarkdown = (text) => {
    const parts = [];
    let lastIndex = 0;
    let keyCounter = 0;
    
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const boldRegex = /\*\*(.+?)\*\*/g;
    const italicRegex = /(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g;
    
    const linkMatches = [];
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      linkMatches.push({
        type: 'link',
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        url: match[2],
        fullMatch: match[0]
      });
    }
    
    const boldMatches = [];
    while ((match = boldRegex.exec(text)) !== null) {
      const isInsideLink = linkMatches.some(l => match.index >= l.start && match.index < l.end);
      if (!isInsideLink) {
        boldMatches.push({
          type: 'bold',
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          fullMatch: match[0]
        });
      }
    }
    
    const italicMatches = [];
    while ((match = italicRegex.exec(text)) !== null) {
      const isInsideBold = boldMatches.some(b => match.index >= b.start && match.index < b.end);
      const isInsideLink = linkMatches.some(l => match.index >= l.start && match.index < l.end);
      if (!isInsideBold && !isInsideLink) {
        italicMatches.push({
          type: 'italic',
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          fullMatch: match[0]
        });
      }
    }
    
    const allMatches = [...linkMatches, ...boldMatches, ...italicMatches].sort((a, b) => a.start - b.start);
    
    allMatches.forEach((match) => {
      if (match.start > lastIndex) {
        const beforeText = text.substring(lastIndex, match.start);
        parts.push(renderMessageWithColorBlocks(beforeText));
      }
      
      if (match.type === 'link') {
        const isExternal = match.url.startsWith('http://') || match.url.startsWith('https://');
        parts.push(
          <a
            key={`link-${keyCounter++}`}
            href={match.url}
            className={styles.markdownLink}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {renderMessageWithColorBlocks(match.text)}
            {isExternal && <MoveUpRight size={14} className={styles.markdownLinkIcon} />}
          </a>
        );
      } else if (match.type === 'bold') {
        parts.push(<strong key={`bold-${keyCounter++}`}>{renderMessageWithColorBlocks(match.content)}</strong>);
      } else {
        parts.push(<em key={`italic-${keyCounter++}`}>{renderMessageWithColorBlocks(match.content)}</em>);
      }
      
      lastIndex = match.end;
    });
    
    if (lastIndex < text.length) {
      parts.push(renderMessageWithColorBlocks(text.substring(lastIndex)));
    }
    
    return parts.length > 0 ? parts : renderMessageWithColorBlocks(text);
  };

  const renderMarkdown = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let listItems = [];
    let inList = false;
    let keyCounter = 0;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (!inList && listItems.length > 0) {
          elements.push(
            <ul key={`list-${keyCounter++}`} className={styles.markdownList}>
              {listItems}
            </ul>
          );
          listItems = [];
        }
        inList = true;
        const listContent = trimmedLine.substring(2);
        listItems.push(
          <li key={`item-${keyCounter++}`} className={styles.markdownListItem}>
            {renderInlineMarkdown(listContent)}
          </li>
        );
      } else {
        if (inList) {
          elements.push(
            <ul key={`list-${keyCounter++}`} className={styles.markdownList}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        
        if (trimmedLine === '') {
          elements.push(<br key={`br-${keyCounter++}`} />);
        } else {
          elements.push(
            <p key={`p-${keyCounter++}`} className={styles.markdownParagraph}>
              {renderInlineMarkdown(trimmedLine)}
            </p>
          );
        }
      }
    });

    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${keyCounter++}`} className={styles.markdownList}>
          {listItems}
        </ul>
      );
    }

    return elements.length > 0 ? elements : renderMessageWithColorBlocks(content);
  };

  const handleConfirmation = async (messageIndex, response) => {
    setPendingConfirmations((prev) => {
      const newMap = new Map(prev);
      newMap.delete(messageIndex);
      return newMap;
    });
    
    setInput("");
    
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "user", content: response }]);
    }, 50);
    
    setIsSending(true);
    setRateLimited(false);
    setRateLimitReset(null);

    try {
      const apiResponse = await sendChatMessage(response);
      
      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev, { role: "assistant", content: apiResponse.message || apiResponse }];
          
          if (apiResponse.requiresConfirmation) {
            const newMessageIndex = newMessages.length - 1;
            setPendingConfirmations((prevConfirmations) => {
              const newMap = new Map(prevConfirmations);
              newMap.set(newMessageIndex, apiResponse.confirmationData || null);
              return newMap;
            });
          }
          
          return newMessages;
        });
      }, 100);
    } catch (error) {
      if (error.message?.includes("Rate limited")) {
        setRateLimited(true);
      } else if (error.message?.includes("Token expired")) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
        }, 100);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div
        className={styles.chatButton}
        onClick={toggleChat}
        onKeyDown={(e) => handleKeyDown(e, toggleChat)}
        role="button"
        tabIndex={0}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X size={24} className={styles.chatButtonIcon} />
        ) : (
          <MessageCircle size={24} className={styles.chatButtonIcon} />
        )}
      </div>

          {isOpen && (
        <div
          ref={chatWindowRef}
          className={styles.chatWindow}
          style={{ transform: `translateX(${position.x}px)` }}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderIcon}>
              <img
                src="/img/emogirls-eyes.png"
                alt="Emogirls"
                className={styles.chatLogo}
              />
            </div>
            <div className={styles.chatHeaderActions}>
              <div
                className={styles.chatMoveButton}
                role="button"
                tabIndex={0}
                aria-label="Move chat"
                onKeyDown={(e) => handleKeyDown(e, () => {})}
              >
                <MdDragIndicator size={18} />
              </div>
              <div
                className={styles.chatCloseButton}
                onClick={toggleChat}
                onKeyDown={(e) => handleKeyDown(e, toggleChat)}
                role="button"
                tabIndex={0}
                aria-label="Close chat"
              >
                <X size={18} />
              </div>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {isLoading ? (
              <div className={styles.chatWelcome}>
                <div className={styles.welcomeIcon}>
                  <MessageCircle size={32} />
                </div>
                <p className={styles.welcomeText}>Confirming authentication...</p>
              </div>
            ) : isAuthenticated && user ? (
              <>
                {messages.length === 0 ? (
                  <div className={styles.chatWelcome}>
                    <p className={styles.welcomeText}>
                      Hi{user.email ? `, ${user.email.split("@")[0]}` : ""}! I'm here to help. Ask me anything about your profile or the documentation.
                    </p>
                  </div>
                ) : (
                  <div className={styles.messagesList}>
                    {messages.map((msg, idx) => {
                      const hasConfirmation = pendingConfirmations.has(idx);
                      const confirmationData = pendingConfirmations.get(idx);
                      
                      return (
                        <React.Fragment key={idx}>
                          <div
                            className={`${styles.message} ${styles[`message${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}`]}`}
                          >
                            <div className={styles.messageContent}>
                              {msg.role === "assistant" 
                                ? renderMarkdown(msg.content)
                                : msg.content}
                            </div>
                          </div>
                          {hasConfirmation && msg.role === "assistant" && (
                            <div className={styles.confirmationButtons}>
                              <div className={styles.confirmationActions}>
                                <div
                                  className={styles.confirmationButton}
                                  onClick={() => handleConfirmation(idx, "yes")}
                                  onKeyDown={(e) => handleKeyDown(e, () => handleConfirmation(idx, "yes"))}
                                  role="button"
                                  tabIndex={0}
                                  aria-label="Confirm"
                                >
                                  Yes
                                </div>
                                <div
                                  className={`${styles.confirmationButton} ${styles.confirmationButtonNo}`}
                                  onClick={() => handleConfirmation(idx, "no")}
                                  onKeyDown={(e) => handleKeyDown(e, () => handleConfirmation(idx, "no"))}
                                  role="button"
                                  tabIndex={0}
                                  aria-label="Cancel"
                                >
                                  No
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                    {isSending && (
                      <div className={`${styles.message} ${styles.messageAssistant}`}>
                        <div className={styles.messageContent}>
                          <span className={styles.thinkingText}>Thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
                {rateLimited && (
                  <div className={styles.rateLimitWarning}>
                    Too many requests. Please wait a moment before sending another message.
                    {rateLimitReset && (
                      <span className={styles.rateLimitReset}>
                        {" "}Resets at: {new Date(rateLimitReset).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.chatWelcome}>
                <div className={styles.welcomeIcon}>
                  <MessageCircle size={32} />
                </div>
                <p className={styles.welcomeText}>
                  {authError || "Please sign in to use the chat."}
                </p>
                <div className={styles.connectButtonWrapper}>
                  <Button
                    onClick={redirectToLogin}
                    icon="LogIn"
                  >
                    Connect Account
                  </Button>
                </div>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className={styles.chatInputContainer}>
              <div className={styles.chatInputWrapper}>
                <input
                  type="text"
                  className={styles.chatInput}
                  placeholder="Ask me anything about your profile..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isSending || rateLimited}
                  maxLength={2000}
                />
                <div
                  className={`${styles.chatSendButton} ${isSending || !input.trim() || rateLimited ? styles.chatSendButtonDisabled : ""}`}
                  onClick={handleSend}
                  onKeyDown={(e) => handleKeyDown(e, handleSend)}
                  role="button"
                  tabIndex={0}
                  aria-label="Send message"
                  aria-disabled={isSending || !input.trim() || rateLimited}
                >
                  <Send size={18} />
                </div>
              </div>
              {input.length > 1800 && (
                <div className={styles.charCount}>
                  {input.length}/2000
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
