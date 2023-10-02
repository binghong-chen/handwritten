// JS 实现一个带并发限制的异度调度器 Scheduler，保证同时运行的任务最多有两个。完善下面代码中的 Scheduler 类，使得以下程序能正确输出。

class Scheduler {
  waitTasks = []; // 待执行的任务队列
  excutingTasks = []; // 正在执行的任务队列
  maxExcutingNum = 2; // 允许同时运行的任务数量
  start = false;

  add(promiseMaker) {
    if (this.excutingTasks.length < this.maxExcutingNum)
      this.excutingTasks.push(promiseMaker);
    else this.waitTasks.push(promiseMaker);
    if (!this.start) {
      this.start = true;
      setTimeout(() => {
        const visit = (list) => {
          list.forEach((fn) => {
            (async () => {
              await fn();
              this.excutingTasks.splice(0, this.excutingTasks.indexOf(fn));
              if (this.waitTasks.length) {
                const fn2 = this.waitTasks.shift();
                this.excutingTasks.push(fn2);
                visit([fn2]);
              }
            })();
          });
        };
        visit(this.excutingTasks);
      });
    }
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
// output：2 3 1 4
// 一开始，1，2两个任务进入队列。
// 500ms 时，2完成，输出2，任务3入队。
// 800ms 时，3完成，输出3，任务4入队。
// 1000ms 时，1完成，输出1。
