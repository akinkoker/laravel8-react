<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;


class TaskController extends Controller
{
    public function index(){
        sleep(2);
        return Task::all();
    }

    public function show($id){
        return Task::find($id);
    }

    public function store(Request $request){
        sleep(2);
        return Task::create($request->all());
    }


    public function update(Request $request, $id){
        sleep(2);
        $task = Task::findOrFail($id);
        $task->update($request->all());
        return $task;
    }

    public function delete(Request $request, $id){
        sleep(2);
        $task = Task::findOrFail($id);
        $task->delete();
        return 204;
    }

}
