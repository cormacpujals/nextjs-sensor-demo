import { Inter } from "next/font/google";

import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Index() {
  const [val, setVal] = useState(50);

  useEffect(() => {
    const sensor = document.getElementById("sensor1");
    let eventSrc;
    let state;

    let connect = () => {
      console.log(`connecting...`);
      eventSrc = new EventSource("/api/data");

      eventSrc.onmessage = (event) => {
        const value = parseInt(event.data, 10);
        if (value > -1) {
          console.log(`value: ${parseInt(event.data, 10)}`);
          // setVal(value);
          sensor.value = event.data;
        }
      };

      eventSrc.onerror = (error) => {
        console.error(`error: ${error}`);
        eventSrc.close();
        connect();
      };
    };

    setInterval(() => {
      if (eventSrc.readyState === state) return;

      state = eventSrc.readyState;
      console.log(`readyState: ${state}`);

      if (state === 0) {
        console.log(`readyState: connecting`);
      } else if (state === 1) {
        console.log(`readyState: open`);
      } else {
        console.log(`readyState: ${eventSrc.readyState}`);
        connect();
      }
    }, 1000);

    connect();
  });

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          Sensor App Demo&nbsp;
        </p>

        <div className="text-center">
          <div className="mt-40">
            <label htmlFor="sensor">Live Sensor Data</label>
            <br />
            <br />
            <br />
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={val}
              readOnly
              id="sensor1"
            />
          </div>
        </div>
        <br />

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black">
          <p className="place-items-center gap-2 p-8 lg:pointer-events-auto">
            &copy; 2023, Cormac Pujals
          </p>
        </div>
      </div>
    </main>
  );
}
