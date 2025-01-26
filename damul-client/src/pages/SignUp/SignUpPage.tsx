import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

import DamulButton from "@/components/common/DamulButton";
import DamulModal from "@/components/common/DamulModal";

import terms from "@/utils/terms";

const checkContents = [
  {
    id: 1,
    label: "(필수) 만 14세 이상입니다.",
  },
  {
    id: 2,
    label: "(필수) 서비스 이용약관에 동의",
  },
  {
    id: 3,
    label: "(필수) 개인정보 수집이용에 동의",
  },
  {
    id: 4,
    label: "(선택) 홍보 및 마케팅 이용에 동의",
  },
  {
    id: 5,
    label: "(선택) 마케팅 개인정보 제3자 제공 동의",
  },
];

// 필수 체크박스 ID들
const requiredIds = [1, 2, 3];

// zod를 이용한 스키마 정의
const formSchema = z.object({
  checkboxes: z
    .array(
      z.object({
        id: z.number(),
        label: z.string(),
      }),
    )
    .refine(
      (val) => {
        // 모든 필수 체크박스가 선택되었는지 확인
        return requiredIds.every((id) => val.some((item) => item.id === id));
      },
      {
        message: "필수 항목을 모두 체크해 주세요.",
      },
    ),
});

const SignUpPage = () => {
  const [isOpenTerm, setIsOpenTerm] = useState(false);
  const [term, setTerm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    // zodResolver를 사용하여 zod 스키마와 연결
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkboxes: [],
    },
  });

  useEffect(() => {
    if (term) {
      setIsOpenTerm(true);
    }
  }, [term]);

  const onSubmit = (data: any) => {
    console.log("회원가입 되었습니다.");
  };

  const handleAllCheckChange = (checked: string | boolean, field: any) => {
    if (checked) {
      // 모든 체크박스를 선택할 경우
      const newCheckboxes = checkContents.map((item) => ({
        id: item.id,
        label: item.label,
      }));
      field.onChange(newCheckboxes);
    } else {
      // 모든 체크박스를 해제할 경우
      field.onChange([]);
    }
  };

  return (
    <main className="px-10">
      <p className="text-xl font-black text-normal-700 mt-36">
        서비스 이용약관에 동의해 주세요.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-20 mt-16"
        >
          <FormField
            control={form.control}
            name="checkboxes"
            render={({ field }) => {
              return (
                <div className="flex flex-col gap-3 relative">
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        className="rounded-full"
                        checked={field.value.length === checkContents.length}
                        onCheckedChange={(checked) =>
                          handleAllCheckChange(checked, field)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-normal-700 text-lg font-bold">
                      네, 모두 동의합니다.
                    </FormLabel>
                  </FormItem>

                  <hr />

                  {checkContents.map((item) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex items-center gap-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            className="rounded-full"
                            checked={field.value.some(
                              (selectedItem) => selectedItem.id === item.id,
                            )}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(
                                    field.value.filter(
                                      (selectedItem) =>
                                        selectedItem.id !== item.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <div className="w-full flex justify-between">
                          <FormLabel
                            className={`w-full text-normal-700 text-base ${form.formState.errors.checkboxes?.message && requiredIds.includes(item.id) && "text-negative-500"}`}
                          >
                            {item.label}
                          </FormLabel>
                          <button
                            className="text-normal-200 shrink-0"
                            type="button"
                            onClick={() => {
                              setTerm(terms[item.id - 1]);
                            }}
                          >
                            보기
                          </button>
                        </div>
                      </FormItem>
                    );
                  })}

                  <FormMessage className="absolute bottom-[-40px] text-negative-500" />
                </div>
              );
            }}
          />

          <DamulModal
            isOpen={isOpenTerm}
            setIsOpen={() => {
              if (isOpenTerm) {
                setIsOpenTerm(false);
                setTerm("");
              }
            }}
            triggerComponent={<div></div>}
            contentStyle="max-w-96"
            title="이용약관"
          >
            <div className="w-full h-52 px-5 overflow-y-auto">{term}</div>
          </DamulModal>

          <DamulButton
            variant="positive"
            size="full"
            textSize="base"
            onClick={() => {}}
          >
            다음
          </DamulButton>
        </form>
      </Form>

      <p className="text-normal-300 text-sm mt-6">
        ‘선택’ 항목에 동의하지 않아도 서비스 이용이 가능합니다.
        <br />
        개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시
        회원제 서비스 이용이 제한됩니다.
      </p>
    </main>
  );
};

export default SignUpPage;
