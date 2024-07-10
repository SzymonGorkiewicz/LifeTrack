import { Component, ElementRef, ViewChild } from '@angular/core';
import { SiteService } from '../../Services/site.service';
import { AuthService } from '../../Services/auth.service';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType, registerables} from 'chart.js';
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
  ngOnInit(){
    this.user = this.auth.getUser()
    this.getBodyStats(this.user.user_id)
    
  }


  getBodyStats(userid:number){
    this.site.getUserBodyStats(userid).subscribe((data:any)=>{
      this.body_stats = data
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
          borderWidth: 1
        },
        {
          label: 'Chest Circumference',
          data: chestCircumferences,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        },
        {
          label: 'Waist Circumference',
          data: waistCircumferences,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1
        }
      ]
    };

    const options: ChartOptions = {
      responsive: false,
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true
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
  
}
