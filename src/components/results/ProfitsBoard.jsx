import React from "react";

export default function ProfitsBoard ({ data }) {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 shadow-md rounded-lg p-4 gap-y-4">
      {Object.entries(data).map(([key, value]) => {
        const tempnum = (Math.round(value.sharesondayone * value.data.slice(-1)[0].close * 100) / 100).toFixed(2);
        const profit = Number(parseFloat(tempnum - value.initialBalance).toFixed(2));
        return (
          <div key={key}>
            <p className="text-4xl mb-2">Allocation: {key}</p>
            <p className="text-base">
              Initial balance: ${value.initialBalance}
            </p>
            <p className="text-base">
              Number of shares: {value.sharesondayone.toFixed(2)}
            </p>
            <p className="text-base">
              Today's Profit: <span style={{color: profit >= 0 ? 'green' : 'red'}}>
                ${profit}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
};