import React, { useState, useEffect } from 'react';
import { IoMdSwap } from "react-icons/io";
import Tofrom from './Tofrom';
import Cryptodropdown from './Cryptodropdown';

function CurrencyCryptoConverter() {
  // Currency Conversion States
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");
  const [fromcurrency, setFromcurrency] = useState("INR");
  const [tocurrency, setTocurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [isCrypto, setIsCrypto] = useState(false); 
  const [crypto, setCrypto] = useState([]); 
  const [fromcrypto, setFromcrypto] = useState("btc");
  const [tocrypto, setTocrypto] = useState("btc");
  const [currentPrize, setCurrentPrize] = useState(1); 
  const [rateInfo, setRateInfo] = useState(""); 

  const apikey = "fca_live_KLvBJ3voFxmi6xuVlPtLEAq9dlxgvYHtzZWgQLBU";

  
  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(Object.keys(data)))
      .catch((error) => setError(error));
  }, []);

   
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/exchange_rates")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          const cryptoNames = Object.keys(data.rates)
            .filter((key) => data.rates[key].type === 'crypto')
            .map((key) => key.toUpperCase());
          setCrypto(cryptoNames);
        }
      })
      .catch((error) => {
        setError("Error fetching cryptocurrency data.");
      });
  }, []);


  const convertCurrency = () => {
    if (!amount) return;
    setConverting(true);

    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${apikey}&base_currency=${fromcurrency}&currencies=${tocurrency}`)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.data[tocurrency];
        if (rate) {
          setConvertedAmount(`${(rate * amount).toFixed(2)} ${tocurrency}`);
        } else {
          setConvertedAmount('Error: Invalid currency data');
        }
      })
      .catch(() => setConvertedAmount('Error fetching data'))
      .finally(() => setConverting(false));     
  };

  
  const handleConversion = async () => {
    // if (!currentPrize || currentPrize <= 0) return;

    setConverting(true); 
    setError(null); 

    try {
      const response = await fetch("https://api.coingecko.com/api/v3/exchange_rates");
      const data = await response.json();
      console.log(data.rates);
      // console.log(tocrypto.toLocaleLowerCase());
      

      if (true) {
        const fromcryptoInLower=fromcrypto.toLocaleLowerCase();
        const tocryptotoInLower=tocrypto.toLocaleLowerCase();

        const fromRate = data.rates[fromcryptoInLower].value;

        const toRate = data.rates[tocryptotoInLower].value;
        

        if (fromRate && toRate) {
          const result = ((currentPrize) * fromRate) / toRate;          
          setConvertedAmount(`${result.toFixed(3)} ${tocrypto.toUpperCase()}`);
          setRateInfo(`1 ${fromcrypto.toUpperCase()} = ${fromRate} ${data.rates[fromcrypto]?.unit}, 1 ${tocrypto.toUpperCase()} = ${toRate} ${data.rates[tocrypto]?.unit}`);
        } else {
          setConvertedAmount("Error: Invalid cryptocurrency data");
          setRateInfo("");
        }
      } else {
        setConvertedAmount("Error fetching exchange rate data");
        setRateInfo("");
      }
    } catch (error) {
      setConvertedAmount("Error fetching cryptocurrency data");
      setRateInfo("");
    } finally {
      setConverting(false);
    }
  };


//  const handleConversion = ()=> {
//   if (!currentPrize) return;
//   setConverting(false);
//   setError(null);

//   fetch('https://api.coingecko.com/api/v3/exchange_rates')
//   .then(response => response.json())
//   .then(data => {
//     const fromRate = data.rates[fromcrypto].value;
//     const toRate = data.rates[tocrypto].value;

//     if (fromRate && toRate) {
//       const result = ((currentPrize) * fromRate) / toRate;
//       setConvertedAmount(`${result.toFixed(3)} ${tocrypto.toUpperCase()}`);
//       setRateInfo(`1 ${fromcrypto.toUpperCase()} = ${fromRate} ${data.rates[fromcrypto]?.unit}, 1 ${tocrypto.toUpperCase()} = ${toRate} ${data.rates[tocrypto]?.unit}`);
//     } else {
//       setConvertedAmount("Error: Invalid cryptocurrency data");
//       setRateInfo("");
//     }
//   })
//   .catch(error => {
//     console.error("Error fetching data from CoinGecko API", error);
//   });

//  }


  const swapCurrencies = () => {
    if (isCrypto) {
      setFromcrypto(tocrypto);
      setTocrypto(fromcrypto);
    } else {
      setFromcurrency(tocurrency);
      setTocurrency(fromcurrency);
    }
  };


  const handleToggleConversion = () => {
    setIsCrypto(!isCrypto);
    setConvertedAmount(null);
    setAmount(1); 

    fetch('https://api.coingecko.com/api/v3/exchange_rates')
  .then(response => response.json())
  .then(data => {
    const fromRate = data.rates[fromcrypto].value;
    const toRate = data.rates[tocrypto].value;

    if (fromRate && toRate) {
      const result = ((currentPrize) * fromRate) / toRate;
      setConvertedAmount(`${result.toFixed(2)} ${tocrypto.toUpperCase()}`);
      setRateInfo(`1 ${fromcrypto.toUpperCase()} = ${fromRate} ${data.rates[fromcrypto]?.unit}, 1 ${tocrypto.toUpperCase()} = ${toRate} ${data.rates[tocrypto]?.unit}`);
    } else {
      setConvertedAmount("Error: Invalid cryptocurrency data");
      setRateInfo("");
    }
  })
  .catch(error => {
    console.error("Error fetching data from CoinGecko API", error);
  });

  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700">{isCrypto ? "Crypto Converter" : "Currency Converter"}</h2>

       
      <div className="flex justify-between mb-4">
        <button onClick={handleToggleConversion} className={`px-4 py-2 rounded-md ${isCrypto ? 'bg-gray-300' : 'bg-indigo-600 text-white'}`}>Currency</button>
        <button onClick={handleToggleConversion} className={`px-4 py-2 rounded-md ${!isCrypto ? 'bg-gray-300' : 'bg-indigo-600 text-white'}`}>Cryptocurrency</button>
      </div>

     
      {isCrypto ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Cryptodropdown crypto={crypto} title="From" currency={fromcrypto} setCurrency={setFromcrypto} />
          <div className="flex justify-center -mb-5 sm:mb-0">
            <button onClick={swapCurrencies} className="p-2 rounded-full cursor-pointer">
              <IoMdSwap size={25} />
            </button>
          </div>
          <Cryptodropdown crypto={crypto} title="To" currency={tocrypto} setCurrency={setTocrypto} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Tofrom currencies={currencies} title="From" currency={fromcurrency} setCurrency={setFromcurrency} />
          <div className="flex justify-center -mb-5 sm:mb-0">
            <button onClick={swapCurrencies} className="p-2 rounded-full cursor-pointer">
              <IoMdSwap size={25} />
            </button>
          </div>
          <Tofrom currencies={currencies} title="To" currency={tocurrency} setCurrency={setTocurrency} />
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="" className="block text-sm font-medium text-gray-700">Amount</label>
        <input type="number" className="p-2 border border-gray-400 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={isCrypto ? currentPrize : amount} onChange={(e) => isCrypto ? setCurrentPrize(e.target.value) : setAmount(e.target.value)} />
      </div>

      <div className="flex justify-end">
        <button onClick={isCrypto? handleConversion :convertCurrency} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-4">
          Convert
        </button>
      </div>

      <div className="mt-4 text-lg font-medium text-right text-green-500">
        {convertedAmount ? `Converted Amount: ${convertedAmount}` : null}
      </div>

      {rateInfo && <div className="mt-2 text-sm text-gray-500"><p>{rateInfo}</p></div>}
      {error && <div className="mt-2 text-sm text-red-500"><p>{error}</p></div>}
    </div>
  );
}

export default CurrencyCryptoConverter;
  