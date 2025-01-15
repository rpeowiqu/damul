# Curation

- 인터넷에 널린 정보들을 주제별, 연계성, 연관성을 지닌 것끼리 모아서 정돈하고 정리해서 알기 쉽게 보여주는 방법

> ### 추천 알고리즘
#### 추천 시스템
- 과거의 사용자 - 아이템 간의 데이터를 분석 해 아이템을 추천하는 것이 추천 시스템의 기본 아이디어
- `User`의 선호 `Item`을 예측하는 시스템

#### 대표적인 추천 알고리즘
- Collaborative Filtering : 협업 필터링
- Content-based Recommender Systems : 컨텐츠 기반 추천 시스템
- Knowledge-based Systems : 지식 기반 추천 시스템
![image.png](./recommendSystem.png)


---

> ### 협업 필터링(Collaborative Filtering)
- 두 명의 사용자가 비슷한 관심사를 가지고 있다면, 한 사용자의 데이터를 바탕으로 다른 사용자에게 추천하는 방식
- 사용자 간의 선호도를 서로 고려해 많은 선택사항들로부터 아이템을 걸러내거나 선택

#### Memory-Based methods
- neighborhood - based collaborative filtering algorithms 라고도 불림
- **사용자 기반 추천(User-based collaborative filtering)**
    - 유저 간의 유사도가 높을수록 가중치를 부여
    - 같은 그룹의 다른 유저가 선호하는 아이템을 추천
    - 일반적으로 특정 A와 유사한 Top K의 유사한 유저들로 그룹을 구성해 선호 아이템 추천
- **아이템 기반 추천 (Item-based collaborative filtering)**
    - B라는 아이템에 대한 유저의 선호도를 예측을 위해 B와 가장 유사한 Top K 아이템을 선정하여 Item Set을 구성

#### Model - based methods
- 머신러닝, 데이터 마이닝 방법에서의 예측 모델 context를 기반한 방법
- 모델이 파라미터화되어 있다면, 이 모델의 파라미터는 context 내에서 학습

**[알고리즘 구현 예시](https://jujeol-jujeol.github.io/2021/08/12/%ED%98%91%EC%97%85-%ED%95%84%ED%84%B0%EB%A7%81/)**

<br>

> #### 협업 필터링의 한계점

**콜드 스타트**
- 전의 결과를 이용해 동작하므로 데이터가 없는 상태에선 제대로 동작하지 않음
- 협업 필터링은 사용자들의 데이터를 기반으로 하기 대문에 신규 사용자에게는 아무런 정보가 없어 추천할 수 없는 상황이 발생함

**계산 효율 저하**
- 협업 필터링은 상당히 많은 계산량을 요구 -> 사용자 수 증가 -> 계산 시간이 더욱 길어짐
- 사용자 수가 많아 데이터가 쌓이게 되면 정확도는 높일 수 있지만, 그만큼 시간이 오래 걸려 효율성이 떨어짐

**롱테일**
- 사용자들이 소수의 인기 있는 항목에만 관심을 보여 관심이 저조한 항목은 추천되지 못하는 문제점이 발생함
- 소수의 인기 컨텐츠가 전체 컨텐츠 비율을 차지하는 현상이 나타남

---

<br>

> ### 컨텐츠 기반 필터링(Content based Filtering)
- 사용자가 과거에 경험했던 아이템 중 비슷한 아이템을 현재 시점에서 추천하는 것
- 정보를 찾는 과정과 과거 정보를 활용해 유저의 성향을 배우는 문제

- 데이터 획득 후, 컨텐츠 분석에서 비정형 데이터로부터 관련 있는 정보를 얻는 작업이 필요
    - feature extraction, vector representation 등의 작업을 수행
    - 유저가 선호하는 아이템과 취향을 파악하는 유저 프로필 파악
    - cosine 유사도를 이용하여 유사 아이템 선택



> #### 컨텐츠 필터링의 한계점
- 사용자가 과거에 경험했던 아이템 중 비슷한 아이템을 현재 시점에서 추천하는 것
- 정보를 찾는 과정과 과거 정보를 활용해 유저의 성향을 배우는 문제임

- 콘텐츠 기반 필터링은 내용 자체를 분석하기 때문에 협업 필터링의 한계인 `콜드스타트` 문제를 해결할 수 있음
- 여러 항목을 동시에 추천해야한다고 할 때, 각 항목에서 추출할 수 있는 정보가 다르다보니 프로파일 구성에 어려움 있음 => _다양한 항목 추천엔 다소 어려움 있음_


---

<br>

> ### 하이브리드 필터링(Hybrid Filtering)
- 협업 필터링 + 지식 기반 추천 시스템 결합

---


<br>

# 스프링 부트와 머신러닝 모델을 이용한 추천 엔진 구현하기
> 추천 엔진
> - 사용자에게 맞춤형 추천을 제공하기 위해 다양한 알고리즘과 데이터 분석 기법을 사용하는 시스템
- 일반적인 스프링부트 기초 세팅은 비슷하기 때문에 별도 설명 X

- 머신러닝 모델 준비 과정
    1. 데이터 준비 : 데이터가 있는 CSV 파일 읽어오기
    2. 머신러닝 모델 선택
        - EX : 협업 필터링 사용
        - 대표 알고리즘 : Matrix Factorization
        - Python의 Suprise 라이브러리 사용해 협업 필터링 모델 학습

    ```Phython
    # 1. 모델 학습
    from surprise import Dataset, Reader, SVD
    from surprise.model_selection import train_test_split
    from surprise import accuracy

    # 데이터 로딩
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['user_id',  'product_id', 'rating']], reader)
    trainset, testset = train_test_split(data, test_size=0.25)

    # 모델 학습
    model = SVD()
    model.fit(trainset)

    # 예측 및 평가
    predictions = model.test(testset)
    accuracy.rmse(predictions)

    # 2. 모델 저장 및 load
    import joblib

    # 모델 저장
    joblib.dump(model, 'svd_model.pkl')

    # 모델 로드
    loaded_model = joblib.load('svd_model.pkl')
    ```

--- 
참고 : [추천시스템](https://velog.io/@dlgkdis801/TIL-%EC%B6%94%EC%B2%9C-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9D%84-%EC%84%A4%EA%B3%84%ED%95%B4%EB%B3%B4%EC%9E%90)
