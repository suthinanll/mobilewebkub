const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;
const firebaseConfig = {
    apiKey: "AIzaSyBKmvbiyXUkCYLhmAybA0kMZFSp4pCjXqo",
    authDomain: "mobileweb2567.firebaseapp.com",
    projectId: "mobileweb2567",
    storageBucket: "mobileweb2567.firebasestorage.app",
    messagingSenderId: "900542790986",
    appId: "1:900542790986:web:bd3dc40a2f90a85fdbd5b3",
    measurementId: "G-7LD3HETK9R"
  };
  class App extends React.Component {
    title = (
        <Alert variant="info">
            <b>Work6 :</b> Firebase
        </Alert>
    );


    footer = (
        <div>
            By 663380006-1 suthinan lamlong <br />
            College of Computing, Khon Kaen University
        </div>
    );


    state = {
        scene: 0,
        students:[],
        id:"",
        title:"",
        fname:"",
        lname:"",
        email:"",
    }
    edit(std) {      
        this.setState({
            id: std.id,
            title: std.title,
            fname: std.fname,
            lname: std.lname,
            email: std.email,
        });
    }


    componentDidMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app();
        }
        this.readData();
    }


    render() {
       
        return (
          <Card>
            <Card.Header>{this.title}</Card.Header>  
            <Card.Body>
              <Button onClick={()=>this.readData()}>Read Data</Button>
              <Button onClick={()=>this.autoRead()}>Auto Read</Button>
              <div>
              <StudentTable data={this.state.students} app={this}/>  
              </div>
            </Card.Body>
            <Card.Footer>
            <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
            <TextInput label="ID" app={this} value="id" style={{width:120}}/>  
            <TextInput label="คำนำหน้า" app={this} value="title" style={{width:100}} />
            <TextInput label="ชื่อ" app={this} value="fname" style={{width:120}}/>
            <TextInput label="สกุล" app={this} value="lname" style={{width:120}}/>
            <TextInput label="Email" app={this} value="email" style={{width:150}} />        
            <Button onClick={()=>this.insertData()}>Save</Button>
            </Card.Footer>
            <Card.Footer>{this.footer}</Card.Footer>
          </Card>          
        );
      }
 


    readData() {
        const db = firebase.firestore();
        db.collection("studens").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });
    }


    autoRead() {
        const db = firebase.firestore();
        db.collection("studens").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }
    insertData() {
        const db = firebase.firestore(); // Declare db here
        db.collection("studens").doc(this.state.id).set({  
            title: this.state.title,  
            fname: this.state.fname,  
            lname: this.state.lname,  
            email: this.state.email,  
        }).then(() => {
            alert('ข้อมูลถูกบันทึกเรียบร้อยแล้ว');
            this.readData();  
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
   
    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("studens").doc(std.id).delete()
                .then(() => {
                    alert("ข้อมูลถูกลบเรียบร้อยแล้ว");
                    this.readData();  
                })
                .catch((error) => {
                    console.error("Error deleting document: ", error);
                });
        }
    }




}
const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
function StudentTable({data, app}){
    return <table className='table'>
    <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
        </tr>
        {
          data.map((s)=><tr>
          <td>{s.id}</td>
          <td>{s.title}</td>
          <td>{s.fname}</td>
          <td>{s.lname}</td>
          <td>{s.email}</td>
          <td><EditButton std={s} app={app}/></td>
          <td><DeleteButton std={s} app={app}/></td>        
          </tr> )
        }
    </table>
  }

  function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
  }
  function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
   }
 
   function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
  }















