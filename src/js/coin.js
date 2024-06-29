import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import markdownIt from "markdown-it";

const supabaseUrl = "https://qielvcdqxiliyvdyrfyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWx2Y2RxeGlsaXl2ZHlyZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4ODU2MzYsImV4cCI6MjAzMzQ2MTYzNn0.FZnrpmfL5gosrfGF2DRdWXpGMaJZSvf67l99mmzoNxo";
const supabase = createClient(supabaseUrl, supabaseKey);

const md = new markdownIt();

const fetchCoinData = async (coinName) => {
  const { data, error } = await supabase
    .from("coins")
    .select("*")
    .eq("coin_name", coinName)
    .single();

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return null;
  }
  return data;
};

const fetchCoinPrice = async (coinbaseProductId) => {
  try {
    const response = await axios.get(
      `https://api.coinbase.com/v2/prices/${coinbaseProductId}/spot`
    );
    return parseFloat(response.data.data.amount);
  } catch (error) {
    console.error("Error fetching price from Coinbase:", error);
    return null;
  }
};

export const renderCoinPage = async () => {
  const coinName = document.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  const coinData = await fetchCoinData(coinName);

  if (!coinData) {
    console.error("Coin data not found");
    return;
  }

  document.getElementById(
    "coin-title"
  ).textContent = `${coinData.coin_name} Roth IRA, ${coinData.coin_name} SEP IRA, ${coinData.coin_name} Traditional IRA | ETZ Soft `;

  const tradingViewEmbed = document.getElementById("tradingview-embed");
  tradingViewEmbed.innerHTML = `
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span class="blue-text"></span>
        </a>
      </div>
    </div>
    <!-- TradingView Widget END -->
  `;

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  script.async = true;
  script.innerHTML = JSON.stringify({
    fullscreen: true,
    symbol: `CRYPTO:${coinData.coin_base}USD`,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "light",
    style: "3",
    locale: "en",
    backgroundColor: "rgba(255, 255, 255, 1)",
    gridColor: "rgba(42, 46, 57, 0)",
    allow_symbol_change: false,
    calendar: false,
    hide_volume: true,
    support_host: "https://www.tradingview.com",
    custom_css_url: "../styles/tradingview-custom.css",
  });

  tradingViewEmbed.appendChild(script);

  const coinContent = document.getElementById("coin-content");
  coinContent.innerHTML = md.render(coinData.ai_content);
};
