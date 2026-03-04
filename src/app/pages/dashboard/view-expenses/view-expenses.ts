import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessDataService } from 'src/app/services/business-data';
import { MatPaginator } from '@angular/material/paginator';
import { ExpenseContent } from 'src/app/models/expense.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth';
import { ViewSingleComponent } from '../view-single/view-single';

@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.html',
  styleUrls: ['./view-expenses.css'],
})
export class ViewExpensesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'name',
    'amount',
    'expense_date',
    'expense_category',
    'payment',
    'comment',
  ];

  ELEMENT_DATA: ExpenseContent[] = [];
  userId: any;
  isLoading = true;
  isDelete = false;
  dataSource = new MatTableDataSource<ExpenseContent>();

  cards: any = [];
  allexpense: any = 0;
  count: any = 0;

  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartConfiguration<'pie'>['data']['datasets'] = [{ data: [] }];
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  years: string[] = [];
  selectedYear = '';
  allMonths: any = {};
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  constructor(
    public businessData: BusinessDataService,
    public dialog: MatDialog,
    public route: Router,
    public authServ: AuthService,
    public _snackBar: MatSnackBar
  ) {
    this.userId = sessionStorage.getItem('Id')?.split(' ')[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isDelete = false;
    this.userId = sessionStorage.getItem('Id')?.split(' ')[1];
    this.getAllExpense(this.userId);
  }

  onHome() {
    this.route.navigate(['home']);
  }

  public updateExpene() {
    const body = {
      expenseLogged: this.businessData.expensesLogged ? this.businessData.expensesLogged : 0,
    };
    this.authServ.updateUserData(this.userId, body);
  }

  public getAllExpense(id: any) {
    this.businessData.onGetAllExpense(id).subscribe(
      (res: any) => {
        this.ELEMENT_DATA = res.data;
        this.dataSource = new MatTableDataSource<ExpenseContent>(this.ELEMENT_DATA);
        this.count = 0;
        const len = res.data.length;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100);

        this.cards = [
          {
            icon: 'today',
            title: 'First Expense Date',
            content: len > 0 ? res.data[0].expense_date : '-',
          },
          {
            icon: 'today',
            title: 'Latest Expense Date',
            content: len > 0 ? res.data[res.data.length - 1].expense_date : '-',
          },
          {
            icon: 'numbers',
            title: 'Number of Expenses',
            content: len,
          },
          { icon: 'monetization_on', title: 'Total Amount', content: 'Rs ' + this.count },
        ];

        this.allexpense = len;
        this.businessData.expensesLogged = this.allexpense;
        this.updateExpene();
        this.pieChartData(res.data);
        this.onBarChartEdit(res.data);
        this.isLoading = false;
      },
      () => {
        this._snackBar.open('Session Expired!!', '', { duration: 2000 });
        this.authServ.onLogout(false);
      }
    );
  }

  cate: any;
  hashMap: any = {};

  public pieChartData(data: any) {
    this.businessData.pieLabels = [];
    this.businessData.piedata = [];
    this.hashMap = {};
    this.count = 0;

    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.hashMap[data[i].expense_category] = 0;
      }

      for (let i = 0; i < data.length; i++) {
        this.hashMap[data[i].expense_category] += data[i].amount;
      }

      for (const key in this.hashMap) {
        if (this.hashMap[key] !== 0) {
          this.businessData.pieLabels.push(key);
          this.businessData.piedata.push(this.hashMap[key]);
          this.count += this.hashMap[key];
        }
      }

      this.pieChartLabels = [...this.businessData.pieLabels];
      this.pieChartDatasets = [{ data: [...this.businessData.piedata] }];
      this.cards[3].content = 'Rs ' + this.count;
    }
  }

  onBarChartEdit(data: any) {
    const hashmap: any = {};
    for (let i = 0; i < data.length; i++) {
      const date = data[i].expense_date.toString().split(' ');
      hashmap[date[3]] = [];
    }
    for (let i = 0; i < data.length; i++) {
      const date = data[i].expense_date.toString().split(' ');
      hashmap[date[3]].push([date[1], data[i].amount]);
    }
    this.businessData.hashmap = hashmap;

    this.years = Object.keys(hashmap).sort();
    this.selectedYear = this.years.length > 0 ? this.years[this.years.length - 1] : '';
    if (this.selectedYear !== '') {
      this.onYearSelectionChange();
    } else {
      this.barChartData = { labels: [], datasets: [] };
    }
  }

  onYearSelectionChange() {
    this.allMonths = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    const data = this.businessData.hashmap[this.selectedYear] || [];
    for (const entry of data) {
      this.allMonths[entry[0]] += entry[1];
    }

    const vals: number[] = [];
    for (const key in this.allMonths) {
      vals.push(this.allMonths[key]);
    }

    this.barChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: vals,
          label: this.selectedYear,
        },
      ],
    };
  }

  onOpen(element: any) {
    this.openDialog();
    const body = {
      action: 'edit',
      data: element,
    };
    this.businessData.data = body;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(Confirm, {
      width: '300px',
      height: '190px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.getAllExpense(this.userId);
      }
    });
  }

  onAdd() {
    this.businessData.onNavigate('home');
  }
}

@Component({
  selector: 'confirm',
  templateUrl: './confirm.html',
})
export class Confirm {
  constructor(
    public dialogRef: MatDialogRef<Confirm>,
    public dialog: MatDialog,
    public businessData: BusinessDataService,
    public route: Router,
    public _snackBar: MatSnackBar
  ) {}

  onOpen() {
    this.route.navigate(['edit', this.businessData.data.data._id]);
  }

  onDelete() {
    this.businessData.onDeleteExpense(this.businessData.data.data._id).subscribe((res: any) => {
      this._snackBar.open(res.message, '', { duration: 2000 });
    });
  }

  onView() {
    this.dialog.open(ViewSingleComponent, {
      width: '300px',
      height: '250px',
    });
  }
}


