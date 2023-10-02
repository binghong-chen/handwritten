// https://juejin.cn/post/7259275893796388925
interface QueueItem<T, R> {
  params: T;
  resolve: (r: R) => void;
  reject: (reson: unknown) => void;
}

/**
 * 创建一个自动合并请求的函数
 * 在一定窗口期内的所有请求都会被合并提交合并发送
 * @param fn 合并后的请求函数
 * @param windowMs 窗口期
 */
function createAutoMergeRequest<T, R>(
  fn: (mergedParams: T[]) => Promise<R[]>,
  windowMs = 200
): (params: T) => Promise<R> {
  let queue: QueueItem<T, R>[] = [];
  let timer: any | null = null;
  // let timer: number | null = null;

  async function submitQueue() {
    timer = null; //  清空计时器以接受后续请求
    const _queue = [...queue];
    queue = []; // 清空队列

    try {
      const list = await fn(_queue.map((q) => q.params));
      _queue.forEach((q1, i) => {
        q1.resolve(list[i]);
      });
    } catch (err) {
      _queue.forEach((q2) => {
        q2.reject(err);
      });
    }
  }

  return (params: T): Promise<R> => {
    if (!timer) {
      // 如果没有开始窗口期，则创建
      timer = setTimeout(() => {
        submitQueue();
      }, windowMs);
    }

    return new Promise<R>((resolve, reject) => {
      queue.push({
        params,
        resolve,
        reject,
      });
    });
  };
}

// 使用

interface UserBaseInfo {
  id: string;
  name: string;
  age: number;
  sex: 0 | 1;
}

const fetchUserInfo = createAutoMergeRequest<string, UserBaseInfo>(
  async (userIds) => {
    const { data } = await requests.post("/api/user/getUsrInfoList", {
      userIds,
    });

    return data;
  }
);

const requests = {
  post(url: string, params: any): Promise<{ data: any }> {
    console.log("post");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: Array.isArray(params.userIds)
            ? params.userIds.map((item: string) => ({
                id: item,
                name: "name" + Math.random().toString().slice(3, 6),
                age: Math.ceil(Math.random() * 40 + 12),
                sex: Math.round(Math.random()),
              }))
            : undefined,
        });
      }, Math.random() * 100 + 100);
    });
  },
};

(async () => {
  fetchUserInfo("1").then(console.log);
  fetchUserInfo("2").then(console.log);
  fetchUserInfo("3").then(console.log);

  setTimeout(() => {
    fetchUserInfo("4").then(console.log);
    fetchUserInfo("5").then(console.log);
  }, 100);

  setTimeout(() => {
    fetchUserInfo("6").then(console.log);
    fetchUserInfo("7").then(console.log);
  }, 198);

  setTimeout(() => {
    fetchUserInfo("8").then(console.log);
    fetchUserInfo("9").then(console.log);
  }, 200);

  setTimeout(() => {
    fetchUserInfo("10").then(console.log);
    fetchUserInfo("11").then(console.log);
  }, 333);
})();
