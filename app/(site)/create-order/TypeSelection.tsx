import { Dispatch, SetStateAction } from "react";
import { TypesOfOrder } from "../types/TypesOfOrder";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TypeSelection({
  orderType,
  setOrderType,
}: {
  orderType: TypesOfOrder;
  setOrderType: Dispatch<SetStateAction<TypesOfOrder>>;
}) {
  return (
    <RadioGroup
      defaultValue={orderType}
      className="flex w-full justify-evenly"
    >
      <div className="flex items-center space-x-2 ">
        <RadioGroupItem
          value="TABLE"
          id="r1"
          onClick={() => {
            setOrderType(TypesOfOrder.TABLE);
          }}
        />
        <Label htmlFor="r1" className="text-2xl hover:cursor-pointer">
          Tavolo
        </Label>
      </div>
      <div className="flex items-center space-x-2 ">
        <RadioGroupItem
          value="TO_HOME"
          id="r2"
          onClick={() => {
            setOrderType(TypesOfOrder.TO_HOME);
          }}
        />
        <Label htmlFor="r2" className="text-2xl hover:cursor-pointer">
          Domicilio
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="PICK_UP"
          id="r3"
          onClick={() => {
            setOrderType(TypesOfOrder.PICK_UP);
          }}
        />
        <Label htmlFor="r3" className="text-2xl hover:cursor-pointer">
          Ritiro in ristorante
        </Label>
      </div>
    </RadioGroup>
  );
}
