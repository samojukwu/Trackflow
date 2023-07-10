import { useState } from "react";
import SalesData from "../components/SalesData";
import styles from "../../styles/Home.module.css"
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  const [templateData, setTemplateData] = useState([])
  const [grossRevenue, setGrossRevenue] = useState(false)
  const [grossProfit, setGrossProfit] = useState(false)

  return (
    <main>
      <SalesData
        grossProfit={(param) => setGrossProfit(param)}
        grossRevenue={(param) => setGrossRevenue(param)}
        templateData={(param) => setTemplateData(param)}
      />
      <div className={styles.header}>
        <div className={styles.backdrop}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <div>
            <Image
              className={styles.logo}
              src="/trackFlow.svg"
              width={134}
              height={24}
              alt="Track flow logo"
            />
          </div>
          <Link
            href="https://template-designer-resources.webflow.io/"
            className={styles.navLink}
          >Dashboard</Link>
        </div>


        <div className={styles.grid}>
          <div className={styles.salesHeader}>
            <div className={styles.divider}></div>
            <div className={styles.salesHeaderBlock}>
              <p className={styles.lightText}>Total revenue</p>
              <div className={styles.usdBlock}>
                <h1>{grossRevenue ? grossRevenue : 0}</h1>
                <p className={styles.usd}>USD</p>
              </div>
            </div>
            <div className={styles.salesHeaderBlock}>
              <p className={styles.lightText}>Total profit</p>
              <div className={styles.usdBlock}>
                <h1>{grossProfit ? grossProfit : 0}</h1>
                <p className={styles.usd}>USD</p>
              </div>
            </div>
          </div>
          <div className={styles.salesList}>
            <div className={styles.saleGrid}>
              <div className={styles.leftAlign}>
                <p className={styles.lightText}>Template</p>
              </div>
              <div className={styles.centerAlign}>
                <p className={styles.lightText}>Distinct sales</p>
              </div>
              <div className={styles.rightAlign}>
                <p className={styles.lightText}>Gross revenue/profit</p>
              </div>
            </div>

            {templateData.length > 0 ?
              templateData.map((item, index) => {
                return (
                  <div key={index} className={styles.salesListItem}>
                    <div className={styles.saleGrid}>
                      <div className={styles.leftAlign}>
                        <p>{item.name}</p>
                      </div>
                      <div className={styles.centerAlign}>
                        <p>{item.sales}</p>
                      </div>
                      <div className={styles.rightAlign}>
                        <p>${item.price} - ${(item.price * 0.8).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              })
              : <div className={styles.salesListItem}>
                <div className={styles.saleGrid}>
                  <div className={styles.leftAlign}>
                    <p>N/A</p>
                  </div>
                  <div className={styles.centerAlign}>
                    <p>N/A</p>
                  </div>
                  <div className={styles.rightAlign}>
                    <p>N/A</p>
                  </div>
                </div>
              </div>}

          </div>
        </div>
      </div>
    </main>
  );
}
