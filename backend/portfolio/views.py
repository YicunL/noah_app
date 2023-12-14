from django.shortcuts import render
from .models import Company

def portfolio_view(request):
    companies = Company.objects.all()  # Query all companies
    return render(request, 'portfolio/portfolio.html')#, {'companies': companies})

