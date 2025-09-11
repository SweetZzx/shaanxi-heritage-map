// 24 条示例数据（经纬度大致分布在陕西省内）
const HERITAGE_DATA = [
  { id: "1", name: "秦腔传统戏剧", category: "传统戏剧", coords: { lat: 34.34, lng: 108.94 }, city: "西安", level: "省级", summary: "以高亢激越著称的关中地方戏，被誉为中国戏曲的活化石。", status: "在展" },
  { id: "2", name: "华阴老腔", category: "传统音乐", coords: { lat: 34.57, lng: 110.09 }, city: "渭南", level: "国家级", summary: "黄河流域古老的民间音乐形态，声如裂帛，气势恢宏。", status: "在展" },
  { id: "3", name: "社火舞蹈", category: "传统舞蹈", coords: { lat: 34.33, lng: 108.70 }, city: "咸阳", level: "市级", summary: "春节期间的民俗舞蹈表演，热闹非凡，寓意吉祥。", status: "在展" },
  { id: "4", name: "碗碗腔", category: "曲艺", coords: { lat: 34.36, lng: 107.24 }, city: "宝鸡", level: "省级", summary: "起源于关中地区的地方曲艺，唱腔优美动听。", status: "在展" },
  { id: "5", name: "安塞腰鼓", category: "传统体育", coords: { lat: 36.87, lng: 109.33 }, city: "延安", level: "国家级", summary: "以雄浑豪迈著称的鼓舞，展现了黄土高原人民的豪放性格。", status: "在展" },
  { id: "6", name: "泥塑技艺（凤翔）", category: "传统美术", coords: { lat: 34.52, lng: 107.39 }, city: "宝鸡", level: "省级", summary: "色彩鲜艳、造型夸张的民间泥塑，具有浓郁的关中风情。", status: "在展" },
  { id: "7", name: "皮影戏制作与表演", category: "传统技艺", coords: { lat: 34.49, lng: 109.50 }, city: "渭南", level: "国家级", summary: "影人雕刻与操演技艺，被称为'世界电影的鼻祖'。", status: "在展" },
  { id: "8", name: "华山药膳", category: "传统医药", coords: { lat: 34.48, lng: 110.07 }, city: "渭南", level: "省级", summary: "以养生为主的药膳文化，融合了道家养生理念。", status: "在展" },
  { id: "9", name: "岁时节令民俗（腊八）", category: "民俗", coords: { lat: 34.27, lng: 108.93 }, city: "西安", level: "市级", summary: "腊八粥、祈福等岁时活动，承载着深厚的文化内涵。", status: "在展" },
  { id: "10", name: "说书（陕北）", category: "民间文学", coords: { lat: 37.50, lng: 109.74 }, city: "榆林", level: "省级", summary: "陕北方言说唱故事艺术，生动展现了黄土地的文化魅力。", status: "在展" },
  { id: "11", name: "户县农民画", category: "传统美术", coords: { lat: 34.10, lng: 108.60 }, city: "西安", level: "国家级", summary: "色彩浓烈、构图饱满的民间绘画，反映了农村生活的美好。", status: "在展" },
  { id: "12", name: "剪纸（陕北）", category: "传统美术", coords: { lat: 37.61, lng: 109.77 }, city: "榆林", level: "国家级", summary: "喜庆吉祥的窗花剪纸，寄托着对美好生活的向往。", status: "在展" },
  { id: "13", name: "擀面皮制作技艺", category: "传统技艺", coords: { lat: 34.36, lng: 107.15 }, city: "宝鸡", level: "市级", summary: "关中小吃的传统制作法，工艺精湛，口感独特。", status: "在展" },
  { id: "14", name: "木版年画（凤翔）", category: "传统美术", coords: { lat: 34.57, lng: 107.39 }, city: "宝鸡", level: "省级", summary: "年节张贴的民间木版画，色彩艳丽，寓意吉祥。", status: "在展" },
  { id: "15", name: "道情皮影（韩城）", category: "传统戏剧", coords: { lat: 35.48, lng: 110.44 }, city: "渭南", level: "省级", summary: "道情曲调与皮影表演结合，具有独特的艺术魅力。", status: "在展" },
  { id: "16", name: "茶艺与斗茶民俗", category: "民俗", coords: { lat: 33.07, lng: 107.03 }, city: "汉中", level: "市级", summary: "茶事活动及习俗，体现了陕南地区的茶文化传统。", status: "在展" },
  { id: "17", name: "秦砖汉瓦拓印技艺", category: "传统技艺", coords: { lat: 34.27, lng: 109.01 }, city: "西安", level: "省级", summary: "以文物纹样为题材的拓印技艺，传承着古代文明的印记。", status: "在展" },
  { id: "18", name: "面花（米脂）", category: "民俗", coords: { lat: 37.76, lng: 110.18 }, city: "榆林", level: "省级", summary: "面塑装饰传统，造型精美，寓意深刻。", status: "在展" },
  { id: "19", name: "舞龙舞狮（关中）", category: "传统舞蹈", coords: { lat: 34.30, lng: 108.94 }, city: "西安", level: "市级", summary: "节庆时的民间舞蹈，气势磅礴，场面壮观。", status: "在展" },
  { id: "20", name: "傩舞（商洛）", category: "传统舞蹈", coords: { lat: 33.87, lng: 109.93 }, city: "商洛", level: "省级", summary: "民间祭祀起源的舞蹈，古朴神秘，历史悠久。", status: "在展" },
  { id: "21", name: "端午龙舟（汉江）", category: "传统体育", coords: { lat: 32.69, lng: 109.02 }, city: "安康", level: "市级", summary: "端午竞渡习俗，体现了团结协作的体育精神。", status: "在展" },
  { id: "22", name: "药王孙思邈传说", category: "民间文学", coords: { lat: 34.70, lng: 109.10 }, city: "铜川", level: "省级", summary: "药王文化相关传说，弘扬了悬壶济世的医者精神。", status: "在展" },
  { id: "23", name: "中医药炮制（商州）", category: "传统医药", coords: { lat: 33.87, lng: 109.93 }, city: "商洛", level: "省级", summary: "本草炮制经验技法，承载着深厚的中医药文化。", status: "在展" },
  { id: "24", name: "耀州瓷烧制技艺", category: "传统技艺", coords: { lat: 34.91, lng: 108.98 }, city: "铜川", level: "国家级", summary: "北方青瓷代表之一，工艺精湛，釉色青翠。", status: "在展" }
];

export default HERITAGE_DATA;
