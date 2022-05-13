import json

from django.contrib.auth.models import User
from django.apps import apps
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.core.mail import send_mail
from django.views.decorators.http import require_POST
from django.conf.global_settings import EMAIL_HOST_USER

from .models import Account
from .forms import UserRegistrationForm, UpdateProfileForm

File = apps.get_model(app_label='files', model_name='File')


def login_page(request):
    # if user is already logged in, redirect him to the home page
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'You are logged in as {username}')

            next_url = request.GET.get('next')
            if next_url:  # redirect user to "next" parameter (if it exists) after login
                return redirect(next_url)
            else:
                return redirect('dashboard')
        else:
            messages.error(request, 'Wrong username or password')

    context = {}
    return render(request, 'accounts/login/index.html', context)


def logout_user(request):
    logout(request)
    return redirect('login')


def register(request):
    # if user is already logged in, redirect him to the home page
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            # create User object
            user = form.save(commit=False)
            user.set_password(
                form.cleaned_data['password']
            )
            # user.username = f"{user.first_name.lower()[0]}_{user.last_name.lower().replace(' ', '_')}"
            user.save()

            # create Account object associated for the user
            account = Account(user=user, role='student')
            account.save()

            # send email to user
            user_f_name = form.cleaned_data['first_name']
            user_l_name = form.cleaned_data['last_name']
            user_email = form.cleaned_data['email']
            subject = "Your account has been created successfully"
            message = f"Hello {user_f_name} {user_l_name}! Your account has been created successfully"
            send_mail(
                subject=subject,
                message=message,
                from_email=EMAIL_HOST_USER,
                recipient_list=[user_email],
                fail_silently=False,
            )

            messages.success(request, "Your account has been created successfully, you can login now")
            return redirect('login')
        else:
            for field in form.errors:
                form[field].field.widget.attrs[
                    'class'] += ' bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:outline-red-500'
    else:
        form = UserRegistrationForm()

    context = {'form': form}
    return render(request, 'accounts/register/index.html', context)


@login_required
def settings(request):
    user = request.user

    if request.method == 'POST':
        form = UpdateProfileForm(request.POST, instance=user, user=user)
        if form.is_valid():
            username = form.cleaned_data['username']
            f_name = form.cleaned_data['first_name']
            l_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']

            user.username = username
            user.first_name = f_name
            user.last_name = l_name
            user.email = email
            user.save()
    else:
        form = UpdateProfileForm(instance=request.user, user=user)

    context = {'form': form}

    return render(request, 'accounts/settings/index.html', context=context)


@login_required
def students_list(request):
    # only teachers can view this page
    if not request.user.account.is_teacher:
        raise Http404

    students_all = User.objects.filter(account__role='student').order_by('date_joined')

    paginator = Paginator(students_all, 20)
    page = request.GET.get('page')
    try:
        students = paginator.page(page)
    except PageNotAnInteger:
        students = paginator.page(1)
    except EmptyPage:
        students = paginator.page(paginator.num_pages)

    context = {
        'students': students,
    }
    return render(request, 'accounts/students_list/index.html', context=context)


@login_required
def profile(request, username):
    try:
        user = User.objects.get(username=username)

        files_all = File.objects.filter(
            owner=user, is_public=True
        ).order_by('-date_created')

        paginator = Paginator(files_all, 20)
        page = request.GET.get('page')
        try:
            files = paginator.page(page)
        except PageNotAnInteger:
            files = paginator.page(1)
        except EmptyPage:
            files = paginator.page(paginator.num_pages)

        context = {
            'user': user,
            'files': files,
        }

        return render(request, 'accounts/profile/index.html', context)
    except:
        raise Http404


@login_required
@require_POST
def change_password(request):
    user = request.user
    message = {}

    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        retype_new_password = request.POST.get('re_new_password')

        if user.check_password(old_password):
            if new_password == retype_new_password and new_password != '':
                user.set_password(new_password)
                user.save()
                message = 'Password was successfully changed'
                update_session_auth_hash(request, request.user)  # This code will keep session when user change password
            else:
                message = 'Invalid Passwords !'
        else:
            message = 'Your old password is wrong !'

    return HttpResponse(json.dumps(message), content_type='application/json')


@login_required
def delete_account(request):
    user = request.user
    user.delete()
    return redirect('account_login')
