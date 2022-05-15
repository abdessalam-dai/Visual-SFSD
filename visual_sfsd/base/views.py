from django.contrib import messages
from django.shortcuts import render, redirect, HttpResponse
from .forms import ContactForm


def home(request):
    return render(request, 'base/home/index.html')


def page_not_found(request, exception):
    return render(request, 'base/404/index.html')


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # create Contact object
            form.save()
            messages.success(request=request, message="Feedback received")
            return redirect('dashboard')
        else:
            for field in form.errors:
                form[field].field.widget.attrs[
                    'class'] += ' bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:outline-red-500'
    else:
        form = ContactForm()

    context = {'form': form}
    return render(request, 'base/contact/index.html', context)
