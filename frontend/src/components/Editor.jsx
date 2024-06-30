import { useState, useRef, useEffect } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-twilight";

const Editor = () => {
  const [language, setLanguage] = useState("nodejs");
  const [script, setScript] = useState("");
  const [stdin, setStdin] = useState("");
  const [response, setResponse] = useState("");
  const [output, setOutput] = useState("");
  const ref = useRef(null);

  const languageOptions = {
    c: "c",
    cpp: "cpp",
    python: "python",
    java: "java",
    nodejs: "javascript",
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleScriptChange = (newScript) => {
    setScript(newScript);
  };

  const handleStdinChange = (newStdin) => {
    setStdin(newStdin);
  };

  const handleSubmit = async () => {
    try {
      const payload = { language, script };
      if (stdin) {
        payload.stdin = stdin;
      }
      const res = await axios.post(
        `http://localhost:3000/api/execute/`,
        payload
      );
      const data = res.data;
      setResponse(JSON.stringify(data, null, 2));

      if (data.error === 0) {
        setOutput(data.output);
      } else {
        setOutput("Error occurred during execution.");
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
      setOutput("");
    }
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="p-5 w-[94%] mx-auto min-h-[100vh]">
      <h1 className="text-5xl font-bold mb-7 font-serif text-white drop-shadow-md shadow-gray">
        CompilerD
      </h1>
      <div className="flex gap-4 h-[70vh]">
        <div className="w-[70%] ">
          <div className="mb-4 flex items-center gap-6">
            <label
              htmlFor="language"
              className="block text-lg font-medium mb-2 text-white"
            >
              {" "}
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="block text-black w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="nodejs">Node.js</option>
            </select>
          </div>
          <AceEditor
            mode={languageOptions[language]}
            theme="twilight"
            placeholder="Enter your code here"
            name="editor"
            onChange={handleScriptChange}
            value={script}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
            width="100%"
            height="100%"
            fontSize={18}
            className="border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-[30%]">
          <div className="mt-12 mb-4 ">
            <label
              htmlFor="stdin"
              className="block text-lg font-medium mb-2 text-white"
            >
              Standard Input (stdin):
            </label>
            <textarea
              id="stdin"
              value={stdin}
              onChange={(e) => handleStdinChange(e.target.value)}
              rows="10"
              className="block w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-10 px-4 py-2 bg-green-500 text-white text-2xl font-bold rounded-md hover:bg-blue-600"
          >
            Execute
          </button>
        </div>
      </div>
      {output && (
        <div>
          <div className="mt-24">
            
            <h2 className="text-xl font-semibold mt-4 mb-2 text-white">
              Standard Input (stdin):
            </h2>
            <pre className="bg-gray-100 p-4 rounded-md">{stdin}</pre>
          </div>
          <div className="mt-4">
            <h2 ref={ref} className="text-2xl font-semibold mt-4 text-white mb-2">
              Output:
            </h2>
            <pre className="bg-gray-200 p-4 rounded-md">{output}</pre>
            {/* <h2 className="text-2xl font-semibold text-white mb-2 mt-4">Response:</h2>
            <pre className="bg-gray-200 p-4 rounded-md">{response}</pre> */}
            <div className="flex justify-around">
              <div className="w-[15%]">
                <h2 className="text-2xl font-semibold mt-4 text-white mb-2">Runtime</h2>
                <pre className="bg-gray-200 p-4 rounded-md">{response.execute_time?response.execute_time:0} mb</pre>
              </div>
              <div className="w-[15%]">
              <h2 className="text-2xl font-semibold mt-4 text-white mb-2">Memory Usage</h2>
              <pre className="bg-gray-200 p-4 rounded-md ">{response.memory?response.memory:0} kb</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
