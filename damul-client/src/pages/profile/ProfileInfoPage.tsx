import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const ingredientHisoryData = [
  { name: "달걀류", count: 3, color: "#f28b82" },
  { name: "유제품", count: 5, color: "#fbbc04" },
  { name: "과일류", count: 8, color: "#fdd663" },
  { name: "육류", count: 25, color: "#97d174" },
  { name: "채소류", count: 12, color: "#6fcf97" },
  { name: "수산물", count: 15, color: "#76d7ea" },
  { name: "양념류", count: 2, color: "#4a90e2" },
  { name: "기름류", count: 1, color: "#ab7fd0" },
  { name: "곡물류", count: 5, color: "#f4a9c0" },
  { name: "기타", count: 11, color: "#cfd8dc" },
];

const chartConfig = {
  count: {
    label: "count",
    color: "#97d174",
  },
} satisfies ChartConfig;

const ProfileInfoPage = () => {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex font-bold py-6 bg-white">
        <div className="flex flex-col items-center flex-1 border-r border-normal-50">
          <p className="text-sm">팔로워</p>
          <p className="text-lg">923,722</p>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-transparent">
          <p className="text-sm">팔로잉</p>
          <p className="text-lg">0</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5 bg-white">
        <h1 className="text-lg font-bold">자기소개</h1>
        <p className="text-normal-600">
          1일 1토마토를 못 먹으면 입 안에 가시가 돋는다.
          <br />
          안녕하세요, 토마토러버 전종우입니다.
          <br />
        </p>
      </div>

      <div className="flex flex-col flex-1 gap-2 p-5 bg-white">
        <h1 className="text-lg font-bold">선호 식자재 그래프</h1>
        <p className="text-normal-600">
          토마토러버전종우님은 <span className="text-negative-500">육류</span>를
          가장 좋아하시는군요!
        </p>
        <ChartContainer config={chartConfig} className="w-full min-h-80">
          <BarChart
            accessibilityLayer
            data={ingredientHisoryData}
            layout="vertical"
          >
            <XAxis className="text-sm" type="number" />
            <YAxis className="text-sm" type="category" dataKey="name" />
            <Bar dataKey="count">
              {ingredientHisoryData.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ProfileInfoPage;
