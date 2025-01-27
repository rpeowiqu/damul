import { Link } from "react-router-dom";

const MarketMainPage = () => {
  return (
    <main className="text-center p-4 pc:p-6">
      <Link to="/community/market/search">
        <div className="space-y-4">공구/나눔 메인 페이지</div>
      </Link>
    </main>
  );
};

export default MarketMainPage;
