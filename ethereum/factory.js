import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x20d1911247565f8E168EE2ac3F8fCf443ddF2127"
);

export default instance;
