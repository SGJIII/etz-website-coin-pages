import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qielvcdqxiliyvdyrfyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWx2Y2RxeGlsaXl2ZHlyZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4ODU2MzYsImV4cCI6MjAzMzQ2MTYzNn0.FZnrpmfL5gosrfGF2DRdWXpGMaJZSvf67l99mmzoNxo";
const supabase = createClient(supabaseUrl, supabaseKey);

const fetchCoinbaseData = async (coinBase) => {
  const productId = `${coinBase}-USD`;
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${productId}/spot`
    );
    if (!response.ok) {
      throw new Error(`Coinbase API returned status ${response.status}`);
    }
    const data = await response.json();
    if (!data.data || !data.data.amount) {
      throw new Error(`Invalid data format from Coinbase API for ${productId}`);
    }
    return {
      price: parseFloat(data.data.amount),
    };
  } catch (error) {
    console.error(`Error fetching data for ${productId}:`, error);
    return null;
  }
};

export const fetchData = async () => {
  const { data, error } = await supabase
    .from("coins")
    .select("*", { count: "exact" }) // Ensure all records are returned
    .not("logo_url", "is", null)
    .not("ai_content", "is", null)
    .not("coin_base", "is", null)
    .order("market_cap_rank", { ascending: true });

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return [];
  }
  return data;
};

export const populateTable = async (data, tableBody) => {
  for (const coin of data) {
    const coinbaseData = await fetchCoinbaseData(coin.coin_base);

    if (coinbaseData) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="name-column">
          <div class="coin-link">
            <img src="${coin.logo_url}" alt="${
        coin.coin_name
      } logo" class="coin-logo">
            <div class="coin-info">
              <span class="coin-name">${coin.coin_name}</span>
              <span class="coin-base">${coin.coin_base}</span>
            </div>
          </div>
        </td>
        <td class="price-column">$${coinbaseData.price.toFixed(2)}</td>
        <td class="buy-column">
          <a href="https://etz.app.link/YM4SdypaQKb" class="buy-button">
            ${coin.is_prime ? "Buy Now" : "Request"}
          </a>
        </td>
        <a href="/${coin.coin_name}.html" class="row-link"></a>
      `;
      tableBody.appendChild(row);
    } else {
      console.log(`Skipping ${coin.coin_name} due to missing price data`);
    }
  }
};
