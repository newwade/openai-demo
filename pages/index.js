import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import styles from "./index.module.css";
import { animateScroll } from "react-scroll";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const exampleElement = useRef("");
  const messageElement = useRef("");

  const handleClick = (e) => {
    setUserInput(
      e.target.innerText.substring(1, e.target.innerText.length - 1)
    );
  };

  const clearExample = () => {
    exampleElement.current.classList.add("d-none");
  };

  const scrollToTop = () => {
    animateScroll.scrollToTop({
      containerId: messageElement.current.getAttribute("id"),
      duration: 500,
      smooth: "easeInOutQuint",
    });
    // messageElement.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: messageElement.current.getAttribute("id"),
      duration: 500,
      smooth: "easeInOutQuint",
    });
    // messageElement.current.scrollTo({
    //   left: 0,
    //   top: messageElement.current.scrollHeight,
    //   behavior: "smooth",
    // });
  };

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setResult((prevResult) => [
        ...prevResult,
        { user: true, content: userInput },
      ]);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textInput: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      const content = data.result.content.toString();
      setResult((prevResult) => [...prevResult, { k9: true, content }]);
      clearExample();
      setUserInput("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [result]);

  return (
    <div>
      <Head>
        <title>New chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/dog.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
          crossOrigin="anonymous"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.4/font/bootstrap-icons.css"
        ></link>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main className={`${styles.main} bg-body-secondary`}>
        <div className={` container bg-white ${styles.chat} `}>
          <div className="d-flex flex-column justify-content-around align-items-center mt-2 header">
            <div
              className="d-flex mb-4 bg-success p-2 text-white rounded"
              onClick={scrollToTop}
            >
              <div className="fs-2">K9</div>
              <div className="fs-2">CHAT</div>
            </div>
            <div
              className="d-flex flex-column align-items-center gap-4 example"
              ref={exampleElement}
            >
              <i className="bi bi-sun fs-5"></i>
              <div className="lead">Examples</div>
              <div className="d-flex flex-column flex-sm-row gap-2 ">
                <span
                  className="bg-body-secondary p-2 rounded btn"
                  onClick={(e) => handleClick(e)}
                >
                  <small>"Explain quantum computing in simple terms"</small>
                </span>
                <span
                  className="bg-body-secondary p-2 rounded btn"
                  onClick={(e) => handleClick(e)}
                >
                  <small>
                    "Got any creative ideas for a 10 year old's birthday?"
                  </small>
                </span>
                <span
                  className="bg-body-secondary p-2 rounded btn"
                  onClick={(e) => handleClick(e)}
                >
                  <small>"How do I make an HTTP request in Javascript?"</small>
                </span>
              </div>
            </div>
          </div>
          <div
            className={`${styles.result} overflow-y-scroll mt-2`}
            id="chat_body"
            ref={messageElement}
          >
            {result.map((chat, index) => {
              return (
                <div
                  className="d-flex gap-2 mb-4 align-items-baseline"
                  key={index}
                >
                  <div className="">
                    {chat.k9 ? (
                      <i className="bi bi-cpu fs-5"></i>
                    ) : (
                      <i className="bi bi-person-circle fs-5"></i>
                    )}
                  </div>
                  <div
                    key={index}
                    className="bg-body-secondary text-dark p-2 rounded"
                  >
                    <div>{chat.content}</div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="d-flex gap-2 mb-4 align-items-baseline">
                <i className="bi bi-cpu fs-5"></i>
                <div className="bg-body-secondary text-dark p-2 rounded">
                  <ReactLoading
                    type="bubbles"
                    color="#000000"
                    height="40px"
                    width="40px"
                  />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className={`${styles.chat__input}`}>
            <input
              type="text"
              name="animal"
              placeholder="Hi there how can I help you today?"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="submit"
              className={`${
                loading ? "bg-secondary" : "bg-success"
              } text-light border`}
              disabled={loading}
            >
              <i className="bi bi-send fs-5"></i>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
