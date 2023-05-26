import React from "react";

const ProfitsBoard = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 shadow-md rounded-lg py-4 gap-y-4">
      {Object.entries(data).map(([key, value]) => {
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
              Today's Profit:{" "}
              {`$${(
                Math.round(
                  value.sharesondayone * value.data.slice(-1)[0].close * 100
                ) / 100
              ).toFixed(2)}`}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfitsBoard;
