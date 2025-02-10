import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";

const chartData = [
  { month: "1월", price: 8700 },
  { month: "2월", price: 9050 },
  { month: "3월", price: 9064 },
  { month: "4월", price: 8680 },
  { month: "5월", price: 9230 },
  { month: "6월", price: 9400 },
  { month: "7월", price: 8480 },
  { month: "8월", price: 9620 },
  { month: "9월", price: 10530 },
  { month: "10월", price: 9680 },
  { month: "11월", price: 9850 },
  { month: "12월", price: 11260 },
];

const categoryData = [
  "달걀류",
  "유제품",
  "과일",
  "육류",
  "채소",
  "수산물",
  "양념",
  "기름",
  "곡물",
  "기타",
];

const chartConfig = {
  price: {
    label: "배추 봄(1kg)",
    color: "#4ade80",
  },
} satisfies ChartConfig;

const StatisticsTrendPage = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="px-6 sm:px-10 py-8 bg-white">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-normal-700">
            식자재 가격 변동 그래프
          </h1>
          <p className="text-sm sm:text-base">
            1주일동안의 <span className="text-green-400">배추 봄(1kg)</span>의
            가격 변동을 알려 드릴게요.
          </p>
        </div>

        <ChartContainer config={chartConfig} className="my-6">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={true}
              interval={0}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Line
              dataKey="price"
              type="linear"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex flex-col gap-3 px-6 sm:px-10 py-8 bg-white">
        <h1 className="text-lg sm:text-xl font-black text-normal-700">
          검색 필터
        </h1>

        <Input
          className="text-sm sm:text-base bg-normal-50 h-9 rounded-lg border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="찾으시는 식자재를 검색해 주세요."
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm text-normal-300">대분류</p>
          <div className="grid grid-cols-4 xs:grid-cols-5 gap-3 border border-normal-50 p-3 rounded-xl">
            {categoryData.map((item, index) => (
              <div
                key={index}
                className="text-sm bg-normal-50 border-none rounded-xl text-normal-400 text-center py-1"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTrendPage;
