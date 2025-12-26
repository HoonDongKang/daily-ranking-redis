# daily-ranking-redis

## 프로젝트 소개

Daily Ranking System을 Redis Sorted Set을 통해 구현해본다.

## User Flow

1. 사용자는 자신이 사용할 닉네임을 입력하여 게임을 시작한다.
2. 30초에 근접할 때 Stop을 클릭하여 기록을 세운다.
3. 게임에 참여한 모든 사람의 전체 랭킹을 기록한다.
4. 전체 랭킹은 00시마다 초기화된다.

## 규칙

1. 사용자의 닉네임은 하루마다 초기화된다.
2. 하루 안에 두 개의 동일한 닉네임을 사용할 수 없다.
3. 일단 무분별한 닉네임 생성 및 게임 참여는 제외
    1. 하루마다 기존 기록은 삭제 예정
4. 나중에 랭킹을 종합해보는 것도 있으면 좋을듯?

### FE

-   닉네임을 통해 가입 시, local storage에 유저 정보 및 기록을 저장
-   새로고침을 하여도 local storage에 저장된 데이터를 불러온다.

## Redis 설계

1. 사용자의 닉네임 중복 확인
    1. `Set`을 통해 저장
    2. Daily 한 Timestamp를 key로 저장
    3. `nicknames:{YYYY-MM-DD}`
2. 전체 랭킹 시스템
    1. `Sorted Set`을 통해 저장
    2. Daily 한 Timestamp를 key로 저장
    3. `ranking:{YYYY-MM-DD}`
        1. member: `username:type:timestamp`
        2. score: `diff`

### 1. Ranking 저장 유무 고민

랭킹 시스템을 저장할 때, `key`는 `ranking:{YYYY-MM-DD}` 으로 저장할 생각이지만, 해당 자료구조에 어떤 데이터를 넣을 지 고민

단순히 `{username, diff}` 같은 구조라면 쉽게 데이터를 넣을 수 있지만 `user`에 저장해야할 데이터가 많다.

-   `username`으로만 저장하면 동일한 유저의 데이터가 덮어씌워진다.
-   `diff`는 절대값이기에 양수, 음수를 보여줘야 한다.
-   `user`가 언제 시도했는지를 기록해줘야 한다.

두 가지 방법을 생각하였다.

1. KEY에 유저 데이터를 모두 저장
   `{username:type:timestamp, diff}` 와 같은 방식으로 데이터를 저장하고 만약 조회해올 경우, 해당 데이터를 파싱하여 사용한다.

2. 데이터를 저장할 Hash 자료구조를 생성
   `{ attemptId, diff }` 와 같은 방식으로 저장하고 `attemptId`를 기록할 Hash 자료구조를 하나 더 추가하여 관리해준다.

`{ key: attemptId, value: { username, diff, timestamp }` 와 같이 하나의 자료구조를 생성하면 JOIN하는 것과 같이 데이터를 조회해올 수 있다.

고려해야할 점

1. `Redis Cloud`의 무료 버전은 30MB의 용량을 가진다.
    1. Attempt를 모두 기록하면 저장소가 남아돌지 않을 것 같다.
    2. 만약 Attempt를 username마다 20개씩만 저장한다고 하면, ranking에 저장되는 데이터와 정합성 문제가 발생할 수 있다.
    3. 그렇다면 비즈니스 로직에서 ranking에서 존재하지 않는 attempt에 대해서만 제거할 수 있는 로직이 추가적으로 필요하다.
    4. 그럼에도 사용자의 시도 횟수가 많아질 수록 터질 가능성은 높다.
    5. 반면에 1번 방식을 사용한다면 랭킹은 매일 10개의 데이터를 제외하고는 제거할 것이기 때문에 터질 가능성이 줄어든다.
    6. 하지만 확장성이 매우 좋지 않을 듯 하다.
    7. 하지만? 미니 프로젝트이기 때문에 확장성은 고려하지 않는다.
