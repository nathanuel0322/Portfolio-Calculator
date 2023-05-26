import React, { useState, useEffect, useContext, PureComponent } from "react";
import { RingLoader } from "react-spinners";
import moment from "moment";
import { getHistoricalDataBySymbol } from "../utils/WTDApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../assets/css/results.css";
import { useNavigate, useLocation } from "react-router-dom";
import ProfitsBoard from "../components/results/ProfitsBoard";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const givendata = location.state.filteredRange;
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = [];
    console.log(givendata);
    for (const stockname in givendata) {
      if (Object.hasOwnProperty.call(givendata, stockname)) {
        const stockData = givendata[stockname].data.map((entry) => {
          const splitDate = entry.date.split("-");
          return {
            // convert from YYYY-MM-DD to MM-DD-YYYY
            date: `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`,
            // round to 2 decimal places and include extra 0s if needed to represent cents
            [stockname]: (
              Math.round(
                givendata[stockname].sharesondayone * entry.close * 100
              ) / 100
            ).toFixed(2),
          };
        });
        data.push(...stockData);
      }
    }
    setData(data);
  }, []);

  useEffect(() => {
    console.log("data just set to: ", data);
  }, [data]);

  const getPieChartData = () => {
    const data = [];
    Object.entries(givendata).forEach(([key, val]) => {
      const obj = {
        name: key,
        value: val.weight,
      };
      data.push(obj);
    });

    return data;
  };

  return (
    <div id="resultsouterdiv">
      <div className="toprightbuttons">
        <button
          id="pastsearchesbutton"
          className="buttons"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
      <h1>Results</h1>
      {data.length > 0 && (
        <div>
          <div>
            <div>
              <ProfitsBoard data={givendata} />
            </div>
            <div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={300} height={300}>
                  <Pie
                    dataKey="allocs"
                    isAnimationActive={false}
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="date" tick={{ fill: "white" }} />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend height={36} />
                {/* Render Line components for each stock dynamically */}
                {Object.keys(data[0])
                  .filter((key) => key !== "date") // Exclude the 'name' property from rendering as a line
                  .map((key, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={key}
                      stroke={`hsl(${Math.random() * 360}, 50%, 60%)`} // Generate a random stroke color
                      activeDot={{ r: 8 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
