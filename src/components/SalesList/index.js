import { useState, useEffect } from 'react';
import FetchedEmails from '../FetchEmails';
import Image from 'next/image';

export default function SalesList({ grossRevenue, grossProfit, templateData }) {
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const getTemplateName = (sentence) => {
    const startPhrase = "New template sale - ";
    const endPhrase = " for";
    const startIndex = sentence.indexOf(startPhrase) + startPhrase.length;
    const endIndex = sentence.indexOf(endPhrase);
    const extractedWord = sentence.substring(startIndex, endIndex);

    return extractedWord
  }

  const getTemplatePrice = (sentence) => {
    const dollarSign = "$";
    const startIndex = sentence.indexOf(dollarSign) + dollarSign.length;
    const extractedNumbers = sentence.substring(startIndex);

    return extractedNumbers
  }

  useEffect(() => {
    if (emails.length > 0) {
      const newSalesData = emails.map((email, i) => {
        const emailSubject = email.payload.headers.find((header) => header.name === 'Subject').value;
        const TemplateName = getTemplateName(emailSubject);
        const TemplatePrice = getTemplatePrice(emailSubject);
        return { name: TemplateName, price: TemplatePrice, index: i };
      });

      setSalesData((prevSalesData) => {
        // Combine the previous sales data with the new sales data
        return prevSalesData.concat(newSalesData);
      });
    }
    const combinedData = {};

    for (const item of salesData) {
      const { name, price } = item;
      const formattedPrice = parseInt(price.replace('.00', ''), 10);
    
      if (combinedData[name]) {
        combinedData[name].price += formattedPrice;
        combinedData[name].sales += 1;
      } else {
        combinedData[name] = {
          price: formattedPrice,
          sales: 1
        };
      }
    }
    
    const result = Object.entries(combinedData).map(([name, { price, sales }]) => ({
      name,
      price,
      sales
    }));
    
    setFormattedData(result)
  }, [emails]);

  useEffect(() => {
    templateData(formattedData)
    let totalRevenue = 0;

    for (const item of formattedData) {
      totalRevenue += item.price;
    }

    grossRevenue(totalRevenue);
    grossProfit(totalRevenue * 0.8)
    formattedData && console.log(formattedData)
  }, [formattedData]);

  return (
    <div>
      <FetchedEmails
        fetchedEmails={(param) => setEmails(param)}
        isLoading={(param) => setLoading(param)}
      />

      {loading && (
        <div className='loader'>
          <Image
            src="/spinner.svg"
            width={25}
            height={25}
            alt="Loading spinner"
          />
        </div>)}
    </div>
  );
}
