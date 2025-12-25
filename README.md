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

## Redis 설계

1. 사용자의 닉네임 중복 확인
    1. `Set`을 통해 저장
    2. Daily 한 Timestamp를 key로 저장
    3. `nicknames:{YYYY-MM-DD}`
2. 전체 랭킹 시스템
    1. `Sorted Set`을 통해 저장
    2. Daily 한 Timestamp를 key로 저장
    3. `ranking:{YYYY-MM-DD}`
