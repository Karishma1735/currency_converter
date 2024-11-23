import React, { useState, useEffect } from 'react';
import { IoMdSwap } from 'react-icons/io';
import Cryptodropdown from './Cryptodropdown'; // Assuming this is your dropdown component

function Cryptoconverter() {
  const [crypto, setCrypto] = useState([]); // List of all cryptocurrencies
  const [fromcrypto, setFromcrypto] = useState('btc');
  const [tocrypto, setTocrypto] = useState('btc');
  const [currentprize, setCurrentprize] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [rateInfo, setRateInfo] = useState('');
  const [error, setError] = useState(null);

  // Fetch available cryptocurrencies and populate dropdown options
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/exchange_rates')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          const cryptoNames = Object.keys(data.rates)
            .filter((key) => data.rates[key].type === 'crypto') // Get only cryptos
            .map((key) => key.toUpperCase()); // Use the keys (currency units) in the dropdown

          setCrypto(cryptoNames);
        } else {
          console.error('No data available for exchange rates.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching exchange rates.');
      });
  }, []);

  // Swap currencies
  const swapcurrencies = () => {
    setFromcrypto(tocrypto);
    setTocrypto(fromcrypto);
  };

  
  const handleConversion = async () => {
    if (!currentprize || currentprize <= 0) return;

    setConverting(true); 
    setError(null); 

    try {
      const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
      const data = await response.json();

      if (data && data.rates) {
      
        if (fromcrypto === tocrypto) {
          setConvertedAmount(`${parseFloat(currentprize).toFixed(2)} ${fromcrypto.toUpperCase()}`);
          setRateInfo('');
          return;
        }

        const fromRate = data.rates[fromcrypto]?.value;
        const toRate = data.rates[tocrypto]?.value;

        if (fromRate && toRate) {
          const result = (parseFloat(currentprize) * fromRate) / toRate; 
          setConvertedAmount(`${result.toFixed(8)} ${tocrypto.toUpperCase()}`);

         
          setRateInfo(`1 ${fromcrypto.toUpperCase()} = ${fromRate} ${data.rates[fromcrypto]?.unit}, 1 ${tocrypto.toUpperCase()} = ${toRate} ${data.rates[tocrypto]?.unit}`);
        } else {
          setConvertedAmount('Error: Invalid cryptocurrency data');
          setRateInfo(''); 
        }
      } else {
        setConvertedAmount('Error fetching exchange rate data');
        setRateInfo(''); 
      }
    } catch (error) {
      setConvertedAmount('Error fetching cryptocurrency data');
      setRateInfo(''); 
      console.error('Error during conversion:', error);
    } finally {
      setConverting(false); 
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700">Crypto Converter</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        
        <Cryptodropdown
          crypto={crypto}
          title="From"
          currency={fromcrypto}
          setCurrency={setFromcrypto}
          isCrypto={true}
        />

      
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button onClick={swapcurrencies} className="p-2 rounded-full cursor-pointer">
            <IoMdSwap size={25} />
          </button>
        </div>

        <Cryptodropdown
          crypto={crypto}
          title="To"
          currency={tocrypto}
          setCurrency={setTocrypto}
          isCrypto={true}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          className="p-2 border border-gray-400 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={currentprize}
          onChange={(e) => setCurrentprize(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleConversion} 
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-4"
        >
          Convert
        </button>
      </div>

      <div className="mt-4 text-lg font-medium text-right text-green-500">
        {convertedAmount ? `Converted Amount: ${convertedAmount}` : null}
      </div>

      {rateInfo && (
        <div className="mt-2 text-sm text-gray-500">
          <p>{rateInfo}</p>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-5">
        <h3 className="text-xl font-semibold text-gray-700">Exchange Rates for All Cryptocurrencies</h3>
        <ul className="mt-2 text-sm text-gray-500">
          {crypto.map((currency) => {
            const rate = ` ${currency} = ${(data.rates[currency]?.value).toFixed(8)} ${data.rates[currency]?.unit}`;
            return <li key={currency}>{rate}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Cryptoconverter;
