import { Component, ElementRef, ViewChild } from '@angular/core';
import { SiteService } from '../../Services/site.service';
import { AuthService } from '../../Services/auth.service';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType, registerables} from 'chart.js';
import { NgForm } from '@angular/forms';
Chart.register(...registerables)


@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss'
})
export class GraphsComponent {
  
  constructor(private site:SiteService, private auth:AuthService){}
  
  body_stats:any[] = []
  user:any
  error:string = ''
  showgraph:boolean = true
  chart:any
  showaddStats:boolean = false
  ngOnInit(){
    this.user = this.auth.getUser()
    this.getBodyStats(this.user.user_id)
    
  }

  onSubmit(form: NgForm){
    let data = {
      "date" :  form.value.addDate,
      "weight" : form.value.addWeight,
      "chest_circ" : form.value.addChest,
      "waist_circ" : form.value.addWaist,

    }

    this.site.AddBodyStatistic(data, this.user.user_id).subscribe((data:any)=>{
      this.body_stats.push(data)
      this.body_stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.UpdateGraphData();
    },(error:any) =>{
      
      
      
    });


  }

  DeleteStats(stat_id:number){
    this.site.DeleteBodyStatistic(stat_id).subscribe((data:any)=>{
      data.id = stat_id
      this.body_stats = this.body_stats.filter(item => item.id!==stat_id)
      this.UpdateGraphData();
    },(error:any) =>{
      
      
      
    });
  }

  UpdateGraphData(){
    const dates = this.body_stats.map(stat => stat.date);
    const weights = this.body_stats.map(stat => stat.weight);
    const chestCircumferences = this.body_stats.map(stat => stat.chest_circ);
    const waistCircumferences = this.body_stats.map(stat => stat.waist_circ);

    this.chart.data.labels = dates;
    this.chart.data.datasets[0].data = weights;

    this.chart.update()
  }


  getBodyStats(userid:number){
    this.site.getUserBodyStats(userid).subscribe((data:any)=>{
      this.body_stats = data
      console.log(this.body_stats)
      this.GenerateGraph()
    },(error:any) =>{
      this.error = error.errorMessage
      
    });
  }

  ToogleGraph(){
    this.showgraph=!this.showgraph

    if(this.showgraph){
      this.chart.update('active')
    }
    else{
      this.chart.update('hide')
    }
  }

  GenerateGraph(){

    const dates = this.body_stats.map(stat => stat.date);
    const weights = this.body_stats.map(stat => stat.weight);
    const chestCircumferences = this.body_stats.map(stat => stat.chest_circ);
    const waistCircumferences = this.body_stats.map(stat => stat.waist_circ);
    
    const data: ChartData = {
      labels: dates,
      datasets: [
        {
          label: 'Weight',
          data: weights,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 6, 
          pointRadius: 0, 
        },
        // {
        //   label: 'Chest Circumference',
        //   data: chestCircumferences,
        //   borderColor: 'rgba(75, 192, 192, 1)',
        //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
        //   borderWidth: 2, 
        //   pointRadius: 0, 
        // },
        // {
        //   label: 'Waist Circumference',
        //   data: waistCircumferences,
        //   borderColor: 'rgba(255, 99, 132, 1)',
        //   backgroundColor: 'rgba(255, 99, 132, 0.2)',
        //   borderWidth: 2, 
        //   pointRadius: 0, 
        // }
      ]
    };

    const options: ChartOptions = {
      responsive: false,
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true,
          title:{
            display:true,
            text: 'Weight'
          }
        }
      }
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: options
    };

    const ctx = document.getElementById('myChartCanva') as HTMLCanvasElement;
    
    
    this.chart = new Chart(ctx, config);
  
  }
  

  AddStatistic(){
    this.showaddStats = !this.showaddStats

  }
}
