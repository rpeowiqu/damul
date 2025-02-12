import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FruitIcon } from "@/components/svg";
import DamulButton from "@/components/common/DamulButton";
import { IngredientTrendInfo } from "@/types/statistics";

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

const trendDummyData: IngredientTrendInfo = [
  {
    categoryId: 1,
    ingredientName: "삼겹살",
    ingredientCode: 1,
  },
  {
    categoryId: 2,
    ingredientName: "삼겹살",
    ingredientCode: 21,
  },
  {
    categoryId: 2,
    ingredientName: "목살",
    ingredientCode: 22,
  },
  {
    categoryId: 3,
    ingredientName: "바나나",
    ingredientCode: 14,
  },
  {
    categoryId: 3,
    ingredientName: "수박",
    ingredientCode: 16,
  },
  {
    categoryId: 4,
    ingredientName: "당근",
    ingredientCode: 66,
  },
];

const chartConfig = {
  price: {
    label: "배추 봄(1kg)",
    color: "#4ade80",
  },
} satisfies ChartConfig;

const StatisticsTrendPage = () => {
  const [categoryBit, setCategoryBit] = useState<number>(0);

  const handleSelectCategory = (index: number) => {
    if (categoryBit & (1 << index)) {
      setCategoryBit(categoryBit & ~(1 << index));
    } else {
      setCategoryBit(categoryBit | (1 << index));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        <div className="flex gap-3 mt-5">
          <DamulButton variant="positive" className="w-20 h-8 sm:w-24 sm:h-10">
            최근 40일
          </DamulButton>
          <DamulButton
            variant="shadow"
            className="w-20 h-8 sm:w-24 sm:h-10 shadow-none"
          >
            최근 1년
          </DamulButton>
        </div>

        <ChartContainer config={chartConfig} className="my-6">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: 15,
              right: 15,
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
            >
              <LabelList
                dataKey="price"
                position="top"
                fill="var(--color-price)"
                className="text-xxxs xs:text-xxs sm:text-xs"
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex flex-col gap-5 px-6 sm:px-10 py-8 bg-white">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg sm:text-xl font-black text-normal-700">
            검색 필터
          </h1>
          <Input
            className="text-sm sm:text-base bg-normal-50 h-9 rounded-lg border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="찾으시는 식자재를 검색해 주세요."
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-normal-300">대분류</p>
          <div className="grid grid-cols-5 gap-3 border border-normal-100 p-3 rounded-xl">
            {categoryData.map((item, index) => (
              <label key={index} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={(categoryBit & (1 << index)) != 0}
                  onChange={() => handleSelectCategory(index)}
                />
                <div className="text-xs xs:text-sm bg-normal-50 border-none rounded-xl text-normal-400 text-center py-1 peer-checked:bg-positive-300 peer-checked:text-white">
                  {item}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-end text-sm">총 8개의 검색 결과</p>
          <div className="h-52 overflow-y-auto">
            {Array.from({ length: 8 }).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 border-b border-normal-100 hover:bg-normal-50"
              >
                <FruitIcon className="size-8" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm text-normal-200">과일</p>
                  <p className="font-bold">사과(1kg)</p>
                </div>
                <DamulButton
                  variant="normal"
                  className="h-8 text-xs xs:text-sm"
                  onClick={scrollToTop}
                >
                  가격 동향 보기
                </DamulButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTrendPage;
