import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [input, setinput] = useState("");
  const [result, setresult] = useState([]);
  const [show, setshow] = useState(false);
  const [allData, setallData] = useState([]);
  const [cache, setcache] = useState({});

  const fetchdata = async () => {
    if (allData.length > 0) return;

    try {
      const res = await fetch(
        "https://6866c9de89803950dbb3e6a6.mockapi.io/Brand"
      );
      const json = await res.json();
      console.log("Fetched Data:", json);
      setallData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim() === "") {
        setresult([]);
        return;
      }

      if (cache[input]) {
        setresult(cache[input]);
      } else {
        const filtered = allData.filter((item) => {
          const match = item.Name?.toLowerCase().includes(input.toLowerCase());
          return match;
        });

        setresult(filtered);
        setcache((prev) => ({ ...prev, [input]: filtered }));
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [input, allData]);

  return (
    <div className="App">
      <h1>AutoComplete Search Tab</h1>
      <div>
        <input
          type="text"
          className="search-bar"
          value={input}
          placeholder="Search for cars..."
          onChange={(e) => {
            setinput(e.target.value);
          }}
          onFocus={() => {
            setshow(true);
          }}
          onBlur={() => {
            setTimeout(() => setshow(false), 200);
          }}
        />
        {show && (
          <div className="result-sec">
            {result.map((r) => (
              <span
                className="results"
                key={r.id}
                onClick={() => {
                  setinput(r.Name);
                  setshow(false);
                }}
              >
                {r.Name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
