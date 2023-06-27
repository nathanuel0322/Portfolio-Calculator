import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App.jsx";
import { useNavigate } from "react-router";
import { db } from "../firebase.js";
import { collection, getDocs } from "@firebase/firestore";
import { toast } from "react-toastify";
import { getHistoricalDataBySymbol } from "../utils/WTDApi.js";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useMediaQuery } from 'react-responsive';

import styles from "../assets/css/pastsearches.module.css";

export default function PastSearches() {
  const isTablet = useMediaQuery({ query: `(min-width: 605px)` });
  const isLaptop = useMediaQuery({ query: `(min-width: 728px)` });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [foundpast, setFoundPast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // gets all the documents in the searches collection for the current user
      const querySnapshot = await getDocs(
        collection(db, "data", user.uid, "searches")
      );

      // maps the data from each document into an array
      const newData = querySnapshot.docs.map((doc) => doc.data()).sort((a, b) => {
        // sort by timestamp, most recent first
        return b.timestamp.seconds - a.timestamp.seconds;
      });

      // filters out any duplicates
      setFoundPast((prevState) => {
        const uniqueData = newData.filter((obj) => {
          return !prevState.some(
            (prevObj) =>
              prevObj.start === obj.start &&
              prevObj.finish === obj.finish &&
              prevObj.balance === obj.balance &&
              // allocation is an array of objects, so we need to stringify it to compare
              JSON.stringify(prevObj.allocation) ===
                JSON.stringify(obj.allocation)
          );
        });
        return [...prevState, ...uniqueData];
      });
      return querySnapshot;
    };

    fetchData();
  }, []);

  const displayPastDataResults = (startDate, endDate, balance, allocation) => {
    processData(startDate, endDate, balance, allocation).then((res) => {
      if (res) {
        navigate("/results", { state: { filteredRange: res } });
      }
    });
  };

  const processData = async (startDate, endDate, balance, allocation) => {
    let dataResults = {};
    await Promise.all(
      allocation.map(async (alloc) => {
        const allocBalance = balance * (alloc.weight / 100);
        const data = await getHistoricalDataBySymbol(alloc.symbol);
        // if data holds a key titled "Note", then there was an error, and alert to user "API is exhausted, please try again in a minute"
        if (data["Note"]) {
          toast.error("API is exhausted, please try again in a minute.", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored",
          });
          return;
        } else {
          const filteredData = Object.entries(data)
            .filter(([key, _]) => {
              return key >= startDate && key <= endDate;
            })
            .reverse();

          // each entry in filteredData is a new date
          const result = filteredData.map((newdate) => {
            return {
              date: newdate[0],
              close: parseFloat(newdate[1]["4. close"]),
              adjusted_close: parseFloat(newdate[1]["5. adjusted close"]),
            };
          });

          if (result) {
            if (!dataResults[alloc.symbol]) {
              dataResults[alloc.symbol] = {
                initialBalance: parseFloat(allocBalance.toFixed(2)),
                initialDate: startDate,
                weight: alloc.weight,
                data: result,
                sharesondayone:
                  (balance * (alloc.weight / 100)) / result[0].close,
              };
            }
          } else {
            toast.error("Something went wrong! Try again.", {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored",
            });
          }
        }
      })
    );
    return dataResults;
  };

  // math stuff for pie chart
  const RADIAN = Math.PI / 180;

  return (
    <div>
      <div id="buttondiv" className={isLaptop ? "toprightbuttons" : "flex flex-row justify-between items-center"}>
        <button id="pastsearchesbutton" className={`buttons ${isLaptop ? "" : "mt-0"}`} onClick={() => navigate("/")}>
          Back to Home
        </button>
        <button id="signoutbutton" className={`buttons ${isLaptop ? "" : "mt-0"}`} onClick={() => logout()}>
          Sign Out
        </button>
      </div>
      <h1>
        Past{" "}
        <span id="searchesspan" className={styles["searchesspan"] + " relative"}>
          Searches
        </span>
      </h1>
      <div id="pastsearchesdiv" className={styles["pastsearchesdiv"] + " flex flex-col items-center justify-center relative"}>
        <h1 className="text-2xl">
          Click on any of your past queries to look at the results again
        </h1>
        {foundpast.length === 0 && (
          <div>
            <h1 className="text-base">
              There aren't any previous query for your account
            </h1>
          </div>
        )}
        {foundpast.length > 0 &&
          foundpast.map((val, index) => {
            const piedata = val.allocation.map((outeralloc) => ({
              name: outeralloc.symbol,
              value: outeralloc.weight,
            }));
            return (
              <div key={index} className={isTablet ? "flex flex-row gap-x-4 justify-center cursor-pointer" : "flex flex-col gap-y-4 justify-center cursor-pointer items-center"}
                onClick={() => displayPastDataResults(val.start, val.finish, val.balance, val.allocation) }
              >
                <div className="flex flex-col justify-center">
                  <p>
                    From{" "}
                    {new Date(val.start).toLocaleDateString(undefined, {
                      year: "numeric", month: "long", day: "numeric",
                    })}{" "}
                    to{" "}
                    {new Date(val.finish).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    Request was made at{" "}
                    {new Date(val.timestamp.seconds * 1000).toLocaleTimeString(
                      undefined,
                      { hour: "2-digit", minute: "2-digit" }
                    )}{" "}
                    on{" "}
                    {new Date(val.timestamp.seconds * 1000).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </div>
                <PieChart
                  width={150}
                  height={175}
                  className={styles["recharts-wrapper"] + styles["piechart"]}
                >
                  <Pie
                    data={piedata}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      index,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="black"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="middle"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={37.5}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {piedata.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${Math.random() * 360}, 50%, 60%)`}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={27}
                    className={styles["recharts-legend-wrapper"]}
                  />
                  <Tooltip />
                </PieChart>
              </div>
            );
          })}
      </div>
    </div>
  );
}
