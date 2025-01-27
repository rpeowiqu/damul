import Feeds from "@/components/common/Feeds";
import DamulSearchBox from "@/components/common/DamulSearchBox";

const RecipeMainPage = () => {
  return (
    <main className="h-full text-center p-4 pc:p-6 space-y-2">
      <DamulSearchBox
        placeholder="찾고 싶은 레시피를 검색해보세요."
        onInputClick={() => console.log("Input clicked")}
        onButtonClick={(value) =>
          console.log("Search button clicked with:", value)
        }
      />
      <Feeds />
    </main>
  );
};

export default RecipeMainPage;
