import { useEffect, useState } from "preact/hooks";

const searchApiKey = "19d83523-c664-4418-9375-f8bdb17a2272";

function debounce(func: VoidFunction, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export default function Search() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [focus, setFocus] = useState(false);

  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await fetch(
      `https://api.swiftcomplete.com/v1/places/?key=${searchApiKey}&text=${debouncedInputValue}&maxResults=5`,
    );

    const data = await res.json();

    setResults(data);
    console.log(data);
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 1500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue, 1500]);

  useEffect(() => {
    search();
  }, [debouncedInputValue]);

  return (
    <>
      <h2 class="text-xl mb-5 mx-3 text-center">
        <form>
          <input
            name="q"
            type="text"
            placeholder="Search..."
            value={inputValue}
            // @ts-expect-error it does exist
            onInput={(e) => setInputValue(e?.target?.value)}
            onfocusin={() => setFocus(true)}
            onfocusout={() =>
              setTimeout(() => {
                setFocus(false);
              }, 100)}
            required
            autoComplete="off"
            class="w-1/3 duration-300 focus:w-3/4 py-1 px-3.5 text-white bg-[#1a1a1a] rounded-full placeholder:text-gray-400 "
          />
        </form>
      </h2>
      {focus && (
        <div class="absolute z-50 md:w-1/3 w-3/4 h-max top-14 left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-3xl text-white">
          <div class="m-3 flex flex-col">
            {results?.map((city, index) => (
              <div
                class="h-10 flex items-center cursor-pointer w-full border-zinc-700"
                style={{
                  borderBottomWidth: index == results.length - 1 ? "0" : "2px",
                }}
                onClick={() => location.assign("/?q=" + city?.primary?.text)}
                key={index}
              >
                <p>{city?.primary?.text}, {city?.secondary?.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
