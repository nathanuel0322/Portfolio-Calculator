import React, { useState, forwardRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/css/portfolioform.css";
import { FormData } from "../../screens/Home.js";
import { stockInfo } from "../../data/stocks.js";
import _debounce from "lodash/debounce";

interface CustomInputProps {
    value?: string;
    onClick?: () => void;
}

export const PortfolioForm = ({
    setFormData,
}: {
    setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
}) => {
    const [addStock, setAddstock] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [suggestedValues, setSuggestedValues] = useState<
        {
            symbol: string;
            name: string;
        }[]
    >([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [dataobj, setDataobj] = useState<{
        balance: number;
        start?: Date;
        finish?: Date;
        allocation: { symbol: string; weight: number }[];
    }>({
        balance: 0,
        allocation: [],
    });

    // toggle add more stocks input
    const addStockButton = () => {
        setAddstock(!addStock);
    };

    // adds and remove stock from the list
    const handleOptionToggle = (option: string) => {
        if (selectedOptions.includes(option)) setSelectedOptions(selectedOptions.filter((item) => item !== option));
        else setSelectedOptions([...selectedOptions, option]);
    };

    const CustomStartInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
        <button type="button" className="datepick buttons" onClick={onClick} ref={ref}>
            {value ? value : "Select a start date"}
        </button>
    ));

    const CustomFinishInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
        <button type="button" className="datepick buttons" onClick={onClick} ref={ref}>
            {value ? value : "Select a finish date"}
        </button>
    ));

    const getStartDate = () => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return today;
    };

    const getFinishDate = () => {
        const today = new Date();
        today.setDate(today.getDate());
        return today;
    };

    const validateForm = () => {
        if (dataobj.balance === 0 || dataobj.balance === undefined) {
            toast.error("Please enter an initial balance.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }

        if (!dataobj.start) {
            toast.error("Please enter a start date.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }

        if (!dataobj.finish) {
            toast.error("Please enter an end date.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }

        if (dataobj.allocation.length === 0) {
            toast.error("Please enter at least one stock for the portfolio and its weight.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }

        if (dataobj.allocation.length > 5) {
            toast.error("Please enter at less than 5 stocks for the portfolio.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }

        const sumValues = dataobj.allocation.reduce((a, b) => a + b.weight, 0);

        if (sumValues !== 100) {
            toast.error("Weights in your allocations do not add up to 100%", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
            });
            return false;
        }

        return true;
    };

    const handleFilter = useCallback(
        _debounce((value) => {
            if (value.toLowerCase() !== "") {
                setSuggestedValues(
                    stockInfo.filter(
                        (stock) =>
                            stock.symbol.toLowerCase().includes(value) || stock.name.toLowerCase().includes(value)
                    )
                );
            } else {
                setSuggestedValues([]);
            }
        }, 300), // Adjust the debounce delay as needed
        []
    );

    useEffect(() => {
        handleFilter(inputValue);
    }, [inputValue, handleFilter]);

    return (
        <form
            id="portfolioform"
            className="flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg p-2"
            onSubmit={(e) => {
                e.preventDefault();
                if (!validateForm()) return;
                if (dataobj.start === undefined || dataobj.finish === undefined) {
                    toast.error("Please enter a start and end date.", {
                        position: toast.POSITION.TOP_CENTER,
                        theme: "colored",
                    });
                    return;
                }
                toast.success("Checking history and calculating portfolio.", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: "colored",
                });

                console.log("form data will be: ", {
                    ...dataobj,
                    start: dataobj.start.toISOString().substring(0, 10),
                    finish: dataobj.finish.toISOString().substring(0, 10),
                });

                setFormData({
                    ...dataobj,
                    start: new Date(dataobj.start).toISOString().substring(0, 10),
                    finish: new Date(dataobj.finish).toISOString().substring(0, 10),
                });
            }}
        >
            <input
                id="balance"
                className="my-3 text-center w-4/5 rounded-lg sm:w-2/5"
                type="number"
                name=""
                placeholder="Enter your starting balance"
                value={dataobj.balance}
                onChange={(event) => setDataobj({ ...dataobj, balance: parseFloat(event.target.value) })}
            />
            <ul id="optionsul" className="flex flex-col max-w-full">
                {selectedOptions.map((stock) => (
                    <li id="optionsli" className="flex justify-between font-medium items-center max-h-96" key={stock}>
                        <input
                            title="Remove stock"
                            type="checkbox"
                            className="w-7 h-7"
                            checked={selectedOptions.includes(stock)}
                            onChange={() => handleOptionToggle(stock)}
                        />
                        <label htmlFor={stock} className=" ">
                            {stock}
                        </label>
                        <input
                            type="number"
                            className="percents text-base text-center"
                            max="100"
                            min="0"
                            id="weight"
                            placeholder="%"
                            onChange={(event) => {
                                const newAllocation = dataobj.allocation.filter((item) => item.symbol !== stock);
                                setDataobj({
                                    ...dataobj,
                                    allocation: [
                                        ...newAllocation,
                                        { symbol: stock, weight: parseFloat(event.target.value) },
                                    ],
                                });
                            }}
                        />
                    </li>
                ))}
            </ul>
            {!addStock && (
                <input
                    title="Add more stocks"
                    type="text"
                    className="m-3 w-4/5 rounded-lg sm:w-2/5"
                    value={inputValue}
                    onChange={(event) => {
                        const value = event.target.value;
                        setInputValue(value);

                        // Run the filtering logic asynchronously
                        setTimeout(() => {
                            if (value.toLowerCase() !== "")
                                setSuggestedValues(
                                    stockInfo.filter(
                                        (stock) =>
                                            stock.symbol.toLowerCase().includes(value) ||
                                            stock.name.toLowerCase().includes(value)
                                    )
                                );
                            else setSuggestedValues([]);
                        }, 0);
                    }}
                />
            )}
            {inputValue.length !== 0 && (
                <ul className="max-h-96 w-80 overflow-y-scroll drop-shadow-md rounded-m p-2">
                    {/* add a check box */}
                    {suggestedValues.map((value, index) => (
                        <li className=" bg-blue-50 text-m m-2 text-left p-1 rounded-md " key={index}>
                            <label className="flex justify-between font-medium items-center gradientText">
                                {value.symbol}
                                <input
                                    type="checkbox"
                                    className=" w-7 h-7"
                                    checked={selectedOptions.includes(value.symbol)}
                                    onChange={() => {
                                        handleOptionToggle(value.symbol);
                                        addStockButton();
                                        setInputValue("");
                                    }}
                                />
                            </label>
                        </li>
                    ))}
                </ul>
            )}
            <div className="text-md flex justify-between items-center w-full p-2 sm:w-80">
                <span id="addstocks" className="text-[80%]">
                    Add stocks {selectedOptions.length}/5{" "}
                </span>
                <span onClick={addStockButton} id="plusbutton">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-9 h-9"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </span>
            </div>
            <ReactDatePicker
                className="w-10"
                selected={dataobj.start}
                onChange={(date) => {
                    if (date) setDataobj({ ...dataobj, start: date });
                }}
                customInput={<CustomStartInput />}
                popperPlacement="bottom"
                maxDate={getStartDate()}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
            />
            <ReactDatePicker
                className="w-10"
                selected={dataobj.finish}
                onChange={(date) => {
                    if (date) setDataobj({ ...dataobj, finish: date });
                }}
                customInput={<CustomFinishInput />}
                popperPlacement="bottom"
                maxDate={getFinishDate()}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
            />
            <input type="submit" value="Check History" className="buttons text-white" />
        </form>
    );
};
