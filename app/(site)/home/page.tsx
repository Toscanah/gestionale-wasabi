import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnSite from "../services/on-site/OnSite";
import ToHome from "../services/to-home/ToHome";
import getOrders from "../sql/orders/getOrders";
import createOrder from "../sql/orders/createOrder";

export default async function Home() {
  return (
    <div className="w-screen p-8 h-screen">
      <Tabs defaultValue="to-home" className="w-full h-full flex flex-col gap-4">
        <TabsList className="w-full h-14">
          <TabsTrigger
            value="on-site"
            className="w-1/2 flex justify-center items-center text-4xl h-12"
          >
            In loco
          </TabsTrigger>
          <TabsTrigger
            value="to-home"
            className="w-1/2 flex justify-center items-center text-4xl h-12"
          >
            Domicilio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="on-site" className="w-full h-[90%] mt-0">
          <OnSite />
        </TabsContent>
        <TabsContent value="to-home" className="w-full h-[90%] mt-0">
          <ToHome orders={await getOrders()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
