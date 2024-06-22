import Overview from "./Overview";

export default function CustomerPage() {
  return (
    <div className="w-screen h-screen p-4 flex gap-4">
      <div className="w-[30%] flex flex-col justify-between p-4">
        <Overview />
      </div>
      <div className="w-[70%]"></div>
    </div>
  );
}
