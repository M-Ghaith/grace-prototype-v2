import './App.css';
import './normal.css';
import {useState, useEffect, useRef} from 'react';

function App() {

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);

  function clearChat(){
    setChatLog([]);
    setIsTyping(false);
  }


  async function handleSubmit(e){
    e.preventDefault();
    if(!input.trim()){
      return;
    }
    const updateChatLog = [...chatLog, {role: "user", content: `${input}`}]
    console.log("Chat log: ", updateChatLog);
    await setChatLog(updateChatLog);
    await setInput("");

    setTimeout(()=>{
      setIsTyping(true);
    }, 400);

    try {
      const response = await fetch("http://localhost:3080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: updateChatLog
        })
      });
      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.message.content};
      const updatedChatLogWithAssistantMessage = [...updateChatLog, assistantMessage];
      await setChatLog(updatedChatLogWithAssistantMessage);
    } catch (error) {
      console.error("React: API connection failed.");
      setIsTyping(false); // Set typing indicator to false after API call is completed
      const errorMessage = { 
        role: "assistant", content: "Ops, something went wrong! Please say again." 
      };
      const updatedChatLogWithError = [...updateChatLog, errorMessage];
      await setChatLog(updatedChatLogWithError);
      return;
    }
    setIsTyping(false);
  }

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [chatLog])

  return (
    <div className="App">
      <aside className="sidemenu">
      <svg id="grace_logo" data-name="Layer 1" viewBox="0 0 980.57 274.11"><path className="cls-1" d="M71.45,262.82q-21.73-35.13-21.74-91.48V158.47q0-58.78,24.53-94.45t64.52-35.65q18.44,0,29.74,4.7a89.91,89.91,0,0,1,21.4,12.69l-7,8.7A96,96,0,0,0,165.9,44q-9.41-4.52-27.14-4.52-20.52,0-35.3,10.26a80,80,0,0,0-24.18,27,133.45,133.45,0,0,0-13.91,38.09,210.19,210.19,0,0,0-4.52,43.66v12.87a233.28,233.28,0,0,0,3.65,41,135.67,135.67,0,0,0,12,37.22,84.66,84.66,0,0,0,22.09,28q13.74,11.31,33.56,13.4l-1,11.13Q93.19,297.94,71.45,262.82ZM149.55,291q24.69-2.1,42.78-15.66V199.16H134.94V187.68h68.52v92.88l-2.08,1.74Q179.81,300,150.24,302.13Z" transform="translate(-49.71 -28.02)"/><path  d="M371.82,302.13H357.91l-43.14-78.27q-18.09,7.3-42.09,7.31H262.59q-3.48,0-13.91-.35V219.69H272q42.78,0,64.7-24.7t21.91-63.31v-3.83q0-38.94-21.91-63.83T272,39.15H260.51v99.49q-5.92,0-11.83-.35V28h24Q320,28,345.56,56.2t25.56,71V132q0,28.88-11.82,51.65A84.12,84.12,0,0,1,325.21,219Z" transform="translate(-49.71 -28.02)"/><path  d="M431.3,302.13H417L508.52,28h2.79l92.18,274.11h-15q-24.71-73.74-39.31-118.62t-27-82.61q-12.35-37.74-12.35-39.83Zm93.22,0H512l-20.87-77.92h12.52Z" transform="translate(-49.71 -28.02)"/><path  d="M680.7,255.17q-31.31-39.3-31.65-94.62,0-29.22,9.56-50.78T687,68a118.24,118.24,0,0,1,43.49-29.39,145.2,145.2,0,0,1,52.87-9.56q33.39-.34,59.83,13.91a123.14,123.14,0,0,1,45.22,41.39L880,91a112,112,0,0,0-41.39-37.91q-25.39-13.57-57-13.57-52.19,0-87,36.52-17.4,18.45-26.09,38.09t-8.7,46.44q0,51.13,28.87,87.31,30.27,39,81.4,42.44l-.7,11.13Q714.1,297.26,680.7,255.17Zm109.58,35.48A116.55,116.55,0,0,0,880.37,242l8,7a127.76,127.76,0,0,1-45.57,39.3,133.54,133.54,0,0,1-52.18,13.57Z" transform="translate(-49.71 -28.02)"/><path class="cls-1" d="M933.58,200.55V28h93.23v9.74H943.32V200.55Zm0,101.58V211.34h23.66v9.39H943.32v72h87v9.39Z" transform="translate(-49.71 -28.02)"/></svg>        
      <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New session
        <span className='hover-text'>A new session will erase your current chat. Grace will not retain any memory of it.</span>
        </div>
        <div className='info-session'>
          <p>Note: if the page refreshes, your current chat will be lost.</p>
          <h4>Send one message at a time.</h4>
          <div className='letop'><p>If Grace stops to respond, please send a follow-up message such as "Are you still there?" without having to refresh the page to save your conversation.</p></div>
          <h4>We recommend using a desktop computer for a better user experience.</h4>
          <p>This is a limited prototype for the purpose of the study and does not represent the final product.</p>
          <p>While we have taken measures to ensure its functionality and privacy, it may still have limitations, and issues.</p>
          <p>If you encounter any problems or have concerns regarding your participation in the study or the functionality of the prototype, please do not hesitate to contact us.</p>
          <a href='info@grace-ai.co'>info@grace-ai.co</a>
        </div>
      </aside>
      <section className="chatbox" ref={chatBoxRef}>
      {chatLog.length === 0 && (
        <div className="empty-chat">
          <h3>We apologize for any inconvenience caused by slow response times or any other issues that may be affecting your experience. Please know that we are actively working to resolve these problems as quickly as possible to ensure a smoother and more enjoyable experience for you. Thank you for your patience and understanding.</h3>
          <p>Your personal information will not be collected or shared, and your chat is not saved on our servers to ensure privacy and confidentiality.</p>
        </div>
        )}
        <div className="chat-log" >
          {chatLog.map((content, index)=>(
            <ChatMessage key={index} content = {content} />
          ))}
        </div>
        {isTyping && ( // Display typing indicator if API call is in progress
          <div className="chat-message chatgpt typing-indicator">
            <div className="chat-message-center">
              <div className="avatar chatgpt"></div>
              <div className="message">
                <div className="typing-text">Typing...</div>
              </div>
            </div>
          </div>
        )}
      </section>
      <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              value = {input}
              onChange = {(e) => setInput(e.target.value)}
              className="chat-input-textarea"
              placeholder='Press enter to send your message'
              rows="1">
            </input>
          </form>
        </div>
    </div>
  );
}

const ChatMessage = ({content}) => {
  const lines = content.content.split("\n");
  return (
    <div
      key={content.timestamp || Date.now()} // Use timestamp as key or generate new one
      className={`chat-message ${
        content.role === "assistant" ? "chatgpt" : ""
      } ${content.role}`}
    >
      <div className="chat-message-center">
        <div className={`avatar ${content.role === "assistant" ? "chatgpt" : ""}`}>
        </div>
        <div className="message">
          {lines.map((line, index) => (<div key={index}>{line}</div>))}
          </div>
      </div>
    </div>
  );
};


export default App;
