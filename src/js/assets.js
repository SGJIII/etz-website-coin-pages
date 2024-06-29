import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qielvcdqxiliyvdyrfyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWx2Y2RxeGlsaXl2ZHlyZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4ODU2MzYsImV4cCI6MjAzMzQ2MTYzNn0.FZnrpmfL5gosrfGF2DRdWXpGMaJZSvf67l99mmzoNxo";
const supabase = createClient(supabaseUrl, supabaseKey);

const fetchCoinbaseData = async (coinbaseProductId) => {
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${coinbaseProductId}/spot`
    );
    const data = await response.json();
    return {
      price: parseFloat(data.data.amount),
    };
  } catch (error) {
    console.error(`Error fetching data for ${coinbaseProductId}:`, error);
    return null;
  }
};

const fetchData = async () => {
  const { data, error } = await supabase
    .from("coins")
    .select("*")
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

export const populateTable = async () => {
  const tableBody = document.querySelector("#assets-table tbody");
  const data = await fetchData();

  for (const coin of data) {
    const coinbaseData = await fetchCoinbaseData(coin.coinbase_product_id);

    if (coinbaseData) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${coin.market_cap_rank}</td>
        <td><img src="${coin.logo_url}" alt="${
        coin.coin_name
      } logo" width="32" height="32"></td>
        <td>${coin.coin_name}</td>
        <td>$${coinbaseData.price.toFixed(2)}</td>
        <td>/* Fetch 24hr change from Coinbase API */</td>
        <td>/* Fetch 24hr trading volume from Coinbase API */</td>
        <td><a href="/${coin.coin_name}.html" class="buy-button">Buy</a></td>
      `;
      tableBody.appendChild(row);
    }
  }
};
