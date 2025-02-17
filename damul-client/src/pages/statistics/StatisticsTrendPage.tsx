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
import {
  KamisChartConfig,
  KamisChartData,
  KamisIngredient,
} from "@/types/statistics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  getKamisIngredients,
  getKamisIngredientTrends,
} from "@/service/statistics";
import {
  CATEGORY_COLOR_MAPPER,
  CATEGORY_INFO,
  CATEGORY_NAME_MAPPER,
  CATEGORY_NUMBER_MAPPER,
} from "@/constants/category";

const StatisticsTrendPage = () => {
  const [categoryBit, setCategoryBit] = useState<number>(0);
  const { data, isLoading } = useQuery<KamisIngredient[]>({
    queryKey: ["kamisIngredients"],
    queryFn: async () => {
      try {
        const response = await getKamisIngredients();
        const list = response.data.ingredientsProductNameLists;
        // await handleKamisIngredientSelect(list[Math.random() * list.length]);
        return list;
      } catch (error) {
        console.error(error);
      }
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
  const [chartData, setChartData] = useState<KamisChartData[]>([]);
  const [chartConfig, setChartConfig] = useState<KamisChartConfig>({
    price: {
      label: "",
      color: "",
    },
  });

  const handleSelectCategory = (index: number) => {
    if (categoryBit & (1 << index)) {
      setCategoryBit(categoryBit & ~(1 << index));
    } else {
      setCategoryBit(categoryBit | (1 << index));
    }
  };

  const handleKamisIngredientSelect = async (item: KamisIngredient) => {
    try {
      const response = await getKamisIngredientTrends({
        period: "recent",
        itemCode: item.itemCode,
        kindCode: item.kindCode,
        ecoFlag: item.ecoFlag,
      });
      setChartData(response.data.priceDataList);
      setChartConfig({
        price: {
          label: item.itemName,
          color: CATEGORY_COLOR_MAPPER.get(
            CATEGORY_NAME_MAPPER.get(item.categoryId),
          ),
        },
      });
      console.log(
        CATEGORY_COLOR_MAPPER.get(CATEGORY_NAME_MAPPER.get(item.categoryId)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="px-6 sm:px-10 py-8 bg-white">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-normal-700">
            식자재 가격 변동 그래프
          </h1>
          <p className="text-sm sm:text-base">
            1주일동안의{" "}
            <span style={{ color: chartConfig.price.color }}>
              {chartConfig.price.label}
            </span>
            의 가격 변동을 알려 드릴게요.
          </p>
        </div>

        <div className="flex justify-end">
          <Select>
            <SelectTrigger className="w-28 h-8 -mb-5">
              <SelectValue placeholder="조회 기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>조회 기간</SelectLabel>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="date"
                >
                  최근 40일
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="title"
                >
                  최근 1년
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <ChartContainer config={{ ...chartConfig }} className="my-6">
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
              dataKey="period"
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
            className="text-sm bg-normal-50 h-9 rounded-lg"
            placeholder="찾으시는 식자재를 검색해 주세요."
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-normal-300">대분류</p>
          <div className="grid grid-cols-5 gap-3 border border-normal-100 p-3 rounded-xl">
            {Array.from(CATEGORY_NAME_MAPPER).map(([key, value]) => (
              <label key={key} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={(categoryBit & (1 << (key - 1))) != 0}
                  onChange={() => handleSelectCategory(key - 1)}
                />
                <div className="text-xs xs:text-sm bg-normal-50 border-none rounded-xl text-normal-400 text-center py-1 peer-checked:bg-positive-300 peer-checked:text-white">
                  {value}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-end text-sm">총 {data?.length}개의 검색 결과</p>
          <div className="h-52 overflow-y-auto">
            {data?.map((item) => (
              <div
                key={item.itemCode + " " + item.kindCode}
                className="flex items-center gap-4 p-2 border-b border-normal-100 hover:bg-normal-50"
              >
                <FruitIcon className="size-8" />
                <div className="flex flex-col flex-1">
                  <p className="text-normal-200 text-xs sm:text-sm">
                    {Object.values(CATEGORY_INFO)[item.categoryId - 1].name}
                  </p>
                  <p className="font-bold text-xs sm:text-sm">
                    {item.itemName} ({item.unit})
                  </p>
                </div>
                <DamulButton
                  variant="normal"
                  className="w-20 sm:w-24 h-8 text-xs sm:text-sm"
                  onClick={() => handleKamisIngredientSelect(item)}
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
