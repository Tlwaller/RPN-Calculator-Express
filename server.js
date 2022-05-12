import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import express from "express";
const app = express();

app.use(express.json());

const sleep = () => new Promise((r) => setTimeout(r, 2000));

app.use("/calculate", (req, res) => {
  let equation = req.body[0].trim().split(" ");
  let result = [];

  const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  equation.map((e) => {
    if (!isNaN(e)) {
      result.push(e);
    } else {
      let num1 = result.pop();
      let num2 = result.pop();

      switch (e) {
        case "+":
          result.push(round(+num2 + +num1));
          break;
        case "-":
          result.push(round(+num2 - +num1));
          break;
        case "*":
          result.push(round(+num2 * +num1));
          break;
        case "/":
          +num1 === 0 || +num2 === 0
            ? res.status(400).send("ERROR: Cannot divide by zero.")
            : result.push(round(+num2 / +num1));
          break;
        case "^":
          result.push(round(Math.pow(+num2, +num1)));
          break;
        default:
          result.splice(0, result.length, e);
      }
    }
  });
  console.log(result);
  if (res.headersSent) {
    return;
  } else if (result.length > 1) {
    return res
      .status(400)
      .send(
        "ERROR: Disproportionate amount of values and operators in equation."
      );
  } else if (result.length < 1 || isNaN(result[0])) {
    return res
      .status(400)
      .send("ERROR: Invalid character found in equation: " + result);
  } else
    return res
      .status(200)
      .send(`Your equation: ${req.body[0]}\nThe result: ${result}`);
});

app.listen(8080, async () => {
  const rainbowTitle = chalkAnimation.rainbow(
    "Welcome to the Express version of my RPN calculator :)"
  );

  await sleep();
  rainbowTitle.stop();
  console.log(`
  ${chalk.bgBlackBright(
    "Go to http://localhost:8080/ and type your equation at the end of the URL to start.\n For example: "
  )}
  ${chalk.blackBright("http://localhost:8080/5 5 5 8 + + -")}
  ${chalk.yellowBright(-13)}
  `);
});
