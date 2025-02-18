import torch
from transformers import GPT2LMHeadModel, PreTrainedTokenizerFast

# 모델과 토크나이저의 경로 지정
model_path = 'app/models/chatbot_model5.pth'
tokenizer_path = 'app/models/tokenizer'

# 디바이스 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 모델 로드
model = GPT2LMHeadModel.from_pretrained("skt/kogpt2-base-v2")  # 기본 모델 불러오기
checkpoint = torch.load(model_path, map_location=device)  # 체크포인트 로드
model.load_state_dict(checkpoint["model_state_dict"])  # 저장된 가중치 불러오기
model.to(device)
model.eval()

# 토크나이저 로드
tokenizer = PreTrainedTokenizerFast.from_pretrained(tokenizer_path)

print("모델과 토크나이저가 성공적으로 로드되었습니다!")


# 응답 생성
def generate_response(model, tokenizer, question, q_tkn="<usr>", sent_tkn="<unused1>", max_length=512):
    model.eval()  # 평가 모드
    with torch.no_grad():
        input_text = f"{q_tkn} {question} {sent_tkn}"
        input_ids = tokenizer.encode(input_text, return_tensors="pt").to(device)

        output = model.generate(
            input_ids,
            max_length=max_length,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
            top_k=10,
            top_p=0.15,
            repetition_penalty=1.2,
            do_sample=True,
        )

        response = tokenizer.decode(output[0], skip_special_tokens=True)
        return response



async def kogpt_service_execution(input_msg):
    response = generate_response(model, tokenizer, input_msg)
    return response