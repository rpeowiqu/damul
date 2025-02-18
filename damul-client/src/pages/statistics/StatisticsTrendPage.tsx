import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
  CATEGORY_COUNT,
  CATEGORY_ICON_MAPPER,
  CATEGORY_ID_MAPPER,
  CATEGORY_NAME_MAPPER,
} from "@/constants/category";
import { debounce } from "@/utils/optimize";

const StatisticsTrendPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [periodText, setPeriodText] = useState<string>("");
  const [period, setPeriod] = useState<"monthly" | "recent">("recent");
  const [categoryBit, setCategoryBit] = useState<number>(
    (1 << CATEGORY_COUNT) - 1,
  );

  const [selectedItem, setSelectedItem] = useState<KamisIngredient>();
  const [chartConfig, setChartConfig] = useState<KamisChartConfig>({
    price: {
      label: "",
      color: "",
    },
  });
  const { data: kamisIngredientData, isLoading: isLoadingKamisIngredientData } =
    useQuery<KamisIngredient[]>({
      queryKey: ["kamisIngredients"],
      queryFn: async () => {
        try {
          const response = await getKamisIngredients();
          return response.data.ingredientsProductNameLists;
        } catch (error) {
          console.error(error);
        }
      },
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    });

  const handleSelectCategory = (index: number) => {
    if (categoryBit & (1 << index)) {
      setCategoryBit(categoryBit & ~(1 << index));
    } else {
      setCategoryBit(categoryBit | (1 << index));
    }
  };

  const handleKamisIngredientSelect = (item: KamisIngredient) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setSelectedItem(item);
    setChartConfig({
      price: {
        label: `${item!.itemName} (${item!.unit})`,
        color: CATEGORY_COLOR_MAPPER[item!.categoryId],
      },
    });
  };

  const handlePeriodChange = (value: "monthly" | "recent") => {
    setPeriod(value);
    setPeriodText(value === "monthly" ? "최근 6개월" : "최근 1개월");
  };

  const fetchChartData = async () => {
    try {
      const response = await getKamisIngredientTrends({
        period,
        itemCode: selectedItem!.itemCode,
        kindCode: selectedItem!.kindCode,
        ecoFlag: selectedItem!.ecoFlag,
      });
      if (response.status === 200) {
        return response.data.priceDataList;
      }
    } catch (error) {
      console.error(error);
    }

    return [];
  };
  const { data: chartData, isLoading: isLoadingChartData } = useQuery<
    KamisChartData[]
  >({
    queryKey: ["chart", selectedItem?.itemName, selectedItem?.kindCode, period],
    queryFn: fetchChartData,
    enabled: !!selectedItem,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoadingKamisIngredientData) {
    return null;
  }

  const filteredData =
    kamisIngredientData?.filter(
      (item) =>
        (categoryBit & (1 << (item.categoryId - 1))) !== 0 &&
        item.itemName.includes(searchKeyword),
    ) || [];

  return (
    <div className="flex flex-col gap-3">
      <div className="px-6 sm:px-10 py-8 bg-white">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-normal-700">
            식자재 평균 가격 변동 그래프
          </h1>
          <p className="text-sm sm:text-base">
            {periodText}동안의{" "}
            <span style={{ color: chartConfig.price.color }}>
              {chartConfig.price.label}
            </span>
            평균 가격 변동을 알려 드릴게요.
          </p>
        </div>

        <div className="flex justify-end">
          <Select
            value={period}
            onValueChange={(value: "monthly" | "recent") =>
              handlePeriodChange(value)
            }
          >
            <SelectTrigger className="w-28 h-10 text-xs xs:text-sm">
              <SelectValue placeholder="조회 기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>조회 기간</SelectLabel>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="recent"
                >
                  최근 1개월
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="monthly"
                >
                  최근 6개월
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <ChartContainer
            config={{ ...chartConfig }}
            className={`${isLoadingChartData && "opacity-30"}`}
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 12,
                left: 40,
                right: 40,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={true}
                axisLine={true}
                interval={0}
                className="text-xxxs xs:text-xxs sm:text-xs font-bold"
              />
              <YAxis
                dataKey="price"
                domain={[
                  (dataMin: number) => dataMin * 0.05,
                  (dataMax: number) => dataMax * 1.8,
                ]}
                hide={true}
              />

              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />

              {chartData && chartData.length > 0 ? (
                <Line
                  dataKey="price"
                  type="linear"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                  dot={true}
                >
                  <LabelList
                    dataKey="price"
                    position="insideTop"
                    fill="var(--color-price)"
                    className="text-xxxs xs:text-xxs sm:text-xs"
                  />
                </Line>
              ) : (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-normal-200 text-sm"
                >
                  해당 기간의 식자재 데이터가 존재하지 않네요.
                </text>
              )}
            </LineChart>
          </ChartContainer>

          {isLoadingChartData && (
            <div className="flex flex-col items-center gap-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 sm:w-10 sm:h-10 text-gray-200 animate-spin fill-positive-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <p className="text-positive-300 font-bold text-xxs sm:text-xs text-center">
                열심히 가격 정보를 가져오고 있어요.
                <br />
                잠시만 기달려 주세요!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 sm:px-10 py-8 bg-white">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg sm:text-xl font-black text-normal-700">
            검색 필터
          </h1>

          <Input
            className="flex-1 text-xs xs:text-sm bg-normal-50 rounded-lg"
            placeholder="찾으시는 식자재를 검색해 주세요."
            onChange={(e) => {
              debounce(
                "setStatisticsSearchKeyword",
                () => setSearchKeyword(e.target.value),
                200,
              )();
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-normal-300">대분류</p>
          <div className="grid grid-cols-5 gap-3 border border-normal-100 p-3 rounded-md">
            {Object.entries(CATEGORY_ID_MAPPER).map(([key, value]) => (
              <label key={key} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={(categoryBit & (1 << (value - 1))) != 0}
                  onChange={() => handleSelectCategory(value - 1)}
                />
                <div className="text-xs xs:text-sm bg-normal-50 border-none rounded-xl text-normal-400 text-center py-1 peer-checked:bg-positive-300 peer-checked:text-white">
                  {key}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-end text-sm">
            총 {filteredData.length}개의 검색 결과
          </p>
          <div className="h-52 overflow-y-auto border border-noraml-50 rounded-md">
            {filteredData.map((item) => (
              <div
                key={item.itemCode + " " + item.kindCode}
                className="flex items-center gap-4 p-2 border-b border-normal-100 hover:bg-normal-50"
              >
                {CATEGORY_ICON_MAPPER[item.categoryId]({
                  className: "size-8",
                })}
                <div className="flex flex-col flex-1">
                  <p className="text-normal-300 text-xxs sm:text-xs">
                    {CATEGORY_NAME_MAPPER[item.categoryId]}
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
