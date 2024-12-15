//todo app
//functionalities:-
//1. add a task - done
//2. delete a task - done
//3. mark a task as done - done
//4. show all tasks - done

import chalk from "chalk";
import {Command} from "commander";
import fs from "fs";

function showAllTasks(){
	console.log(chalk.blue("Green represents the completed tasks !"));
	let serialNo = 1;
	const data = fs.readFileSync("./data.json", "utf8");
	const allTasks = JSON.parse(data);
	allTasks["remaining"].forEach(task => {
		const message = `${serialNo}. ${task}`;
		console.log(message);
		serialNo++;
	});
	allTasks["completed"].forEach(task => {
		const message = chalk.green(`${serialNo}. ${task}`);
		console.log(message);
		serialNo++;
	});
}

function addTask(task){
	fs.readFile("./data.json", "utf8", function(err, data){
		if(err){
			console.log(chalk.red(err.message));
		}
		else{
			const allTasks = JSON.parse(data);
			allTasks["remaining"].push(task);
			fs.writeFile("./data.json", JSON.stringify(allTasks), "utf8", function(err){
	            if(err) {
	                console.log(err.message);
	            }
	            else{
	                console.log(chalk.blue("Task addded successfully!"));
	                showAllTasks();
	            }
        	});
		}
	});
}

function markAsDone(taskNo){
	fs.readFile("./data.json", "utf8", function(err, data){
		if(err){
			console.log(chalk.red(err.message));
		}
		else{
			const allTasks = JSON.parse(data);
			if(allTasks["remaining"].length < taskNo || taskNo < 1){
				console.log(chalk.red("Please Enter a valid task Number !"));
			}
			else{
				const temp = allTasks["remaining"][taskNo-1]
				allTasks["remaining"].splice(taskNo-1, 1)
				allTasks["completed"].push(temp)
				fs.writeFile("./data.json", JSON.stringify(allTasks), "utf8", function(err){
		            if(err) {
		                console.log(err.message);
		            }
		            else{
		                console.log(chalk.blue("Task Marked as done successfully!"));
		                showAllTasks();
		            }
	        	});
			}
		}
	});
}

function deleteTask(taskNo){
	fs.readFile("./data.json", "utf8", function(err, data){
		if(err){
			console.log(chalk.red(err.message));
		}
		else{
			const allTasks = JSON.parse(data);
			if(allTasks["remaining"].length + allTasks["completed"].length < taskNo || taskNo < 1){
				console.log(chalk.red("Please Enter a valid task Number !"));
			}
			else{
				let category;
				if(taskNo <= allTasks["remaining"].length){
					category = "remaining"
				}
				else{
					category = "completed"
					taskNo -= allTasks["remaining"].length
				}
				allTasks[`${category}`].splice(taskNo-1, 1)
				fs.writeFile("./data.json", JSON.stringify(allTasks), "utf8", function(err){
		            if(err) {
		                console.log(err.message);
		            }
		            else{
		                console.log(chalk.blue("Task Deleted Successfully!"));
		                showAllTasks();
		            }
	        	});
			}
		}
	});
}

//designing the cli interface

const desc = `node app.js option <option(s)>
node app.js option 1 - show all tasks
node app.js option 2 taskName - add a task(taskName)
node app.js option 3 taskNo - mark taskNo as done
node app.js option 4 taskNo - delete taskNo`

const program = new Command();

program
  .name('todo-app')
  .description('node.js CLI based todo app')
  .version('1.0.0');

program.command('option [option] [data]')
  .description(desc)
  .action((option = 0, data = '') => {  // Setting defaults for option and data
  	if(option == 0){
  		console.log(chalk.red("Enter a valid option !"));
  	}
    else if(option == 1){
      showAllTasks();
    }
    else if(option == 2){
      if(!data) {
        console.log(chalk.red("Please provide a task !"));
        return;
      }
      addTask(data);
    }
    else if(option == 3){
      if(!data){
        console.log(chalk.red("Please provide a task number !"));
        return;
      }
      markAsDone(data);
    }
    else if(option == 4){
      if(!data){
        console.log(chalk.red("Please provide a task number !"));
        return;
      }
      deleteTask(data);
  }
});

program.parse();