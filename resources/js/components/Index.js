import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Toast } from './common';

class Index extends React.Component{
    constructor(){
        super();
        this.state = {
            loading: true,
            tasks: [],
            operation_task:{}, //
            toast_msg:'',

            modal_type:'ADD', //ADD, EDIT, DELETE
            btn_saveTask_disable:false,
            saveTask_name:'',
            saveTask_description:'',
        }
    }
    
    componentDidMount(){
        this.loadTask();
    }

    loadTask() {
        axios.get("http://127.0.0.1:8000/api/tasks/").then(res=>{
            this.setState({tasks:res.data, loading:false});
        });
    }

    addOrEditTask(){    
        let {tasks, saveTask_name,saveTask_description, modal_type, operation_task} = this.state;
        let err_msg      = '';
        let _name        = saveTask_name.trim();
        let _description = saveTask_description.trim();
        if(!_name)        err_msg += 'İsim Girmemişsiniz! ';
        if(!_description) err_msg += 'Açıklama Girmemişsiniz!';

        if(err_msg){
            this.setState({toast_msg:err_msg},()=> $('.toast').toast("show") );
            return false;
        }

        
        if(modal_type==='ADD'){

            this.setState({btn_saveTask_disable:true, toast_msg:'Kaydediliyor.. Lütfen Bekleyin.'}, ()=> $('.toast').toast("show") );
            $('.modal').modal("hide");

            axios.post("http://127.0.0.1:8000/api/tasks/",{name:_name, description:_description}).then(res=>{                
                tasks.push(res.data);
                this.setState({tasks, saveTask_name:'', saveTask_description:'',btn_saveTask_disable:false, toast_msg:'Kaydedildi.'});
            });

        } else if(modal_type==='EDIT'){ 

            this.setState({btn_saveTask_disable:true, toast_msg:`Değiştiriliyor.. Lütfen Bekleyin.`}, ()=> $('.toast').toast("show") );
            $('.modal').modal("hide");
            
            axios.put("http://127.0.0.1:8000/api/tasks/"+operation_task.id,{name:_name, description:_description}).then(res=>{
                let updated_tasks = tasks.map(row =>
                    row.id === operation_task.id ? { ...row, name:_name, description:_description }
                                                 : row
                );
                
                this.setState({tasks:updated_tasks, saveTask_name:'', saveTask_description:'',btn_saveTask_disable:false, operation_task:{}, toast_msg:'Değiştirildi.'});
            });

        }
        

    }
 

    deleteTask(){
        let {operation_task, tasks} = this.state;
        $('.modal').modal("hide");

        if(operation_task.id>0){
            this.setState({btn_saveTask_disable:true, toast_msg:`Siliniyor.. Lütfen Bekleyin.`}, ()=> $('.toast').toast("show") );
            axios.delete("http://127.0.0.1:8000/api/tasks/"+operation_task.id).then(res=>{                
                $('.modal').modal("hide");
                this.setState({tasks:tasks.filter(row => row.id != operation_task.id), btn_saveTask_disable:false, operation_task:{}, toast_msg:'Silindi.'});                
            });
        } else {
            this.setState({toast_msg:'Silinecek kayıt bulunamadı !'},()=> $('.toast').toast("show") );            
            return false;
        }        
    }


    save_or_delete_btn_click = () =>{
        let {modal_type} = this.state;
        if(['ADD','EDIT'].includes(modal_type)) this.addOrEditTask();
        else if(modal_type==='DELETE')          this.deleteTask();
        
    }

    openModal = (data) =>{        
        
        if(data.modal_type==='ADD'){
            this.setState({modal_type:data.modal_type}, ()=>{
                $('#AddOrEditModal').modal('show');
            });    

        } else if(data.modal_type==='EDIT'){
            this.setState({modal_type:data.modal_type, operation_task:data.row, saveTask_name: data.row.name, saveTask_description: data.row.description}, ()=>{
                $('#AddOrEditModal').modal('show');
            });        

        } else if(data.modal_type==='DELETE'){
            this.setState({modal_type:data.modal_type, operation_task:data.row}, ()=>{
                $('#AddOrEditModal').modal('show');
            });    

        }
        
        
        if(['ADD','DELETE'].includes(data.modal_type)){
            console.log(data.row);

        } else if(data.modal_type==='EDIT'){
        }
    }


    return_spinner = () =>{
        return (                    
            <div className="d-flex justify-content-center mt-2">
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return_table = () => {
        
        let tasks = this.state.tasks.map(row=>{
            return( 
                <tr key={row.id}>
                    <th scope="row">{row.id}</th>
                    <td>{row.name}</td>
                    <td>{row.description}</td>
                    <td>
                        <button className="btn btn-success btn-sm mr-2" onClick={()=>{ this.openModal({modal_type:'EDIT',   row}) }} >Edit</button>
                        <button className="btn btn-danger btn-sm"       onClick={()=>{ this.openModal({modal_type:'DELETE', row}) }} >Delete</button>
                    </td>
                </tr>
            )
        });

        return(
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{tasks}</tbody>
            </table>            
        );
    }

    render(){

        let {loading, btn_saveTask_disable, saveTask_name, saveTask_description, toast_msg, modal_type} = this.state;
        return (
            <div className="container">
                <nav className="navbar navbar-dark bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand">Task CRUD</a>
                        <button type="button" className="btn btn-primary" onClick={()=>{ this.openModal({modal_type:'ADD'}) }}>Add Task</button>
                    </div>
                </nav>
                {
                    loading ? this.return_spinner()
                            : this.return_table()
                }

                {/* ADD|EDIT TASK MODAL */ }
                <div className="modal fade" id="AddOrEditModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {
                                    (modal_type==='DELETE')  
                                    ? 
                                        <div><span>Silmek istediğinizden emin misiniz?</span></div>
                                    :
                                        <div>
                                            <div className="mb-3 row">
                                                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Name</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" id="name"
                                                        value={saveTask_name}
                                                        onChange={e=>{ this.setState({saveTask_name: e.target.value}) }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Description</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" id="description"
                                                        value={saveTask_description}
                                                        onChange={e=>{ this.setState({saveTask_description: e.target.value}) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                }
                                
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" disabled={btn_saveTask_disable} onClick={()=>this.save_or_delete_btn_click()}>
                                    {modal_type==='DELETE' ? 'Delete' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOAST */ }
                <Toast props={{msg:toast_msg}}/>

            </div>
        )
    }
}

export default Index;

if (document.getElementById('index')) {
    ReactDOM.render(<Index />, document.getElementById('index'));
}

