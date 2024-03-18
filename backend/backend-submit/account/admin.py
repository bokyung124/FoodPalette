from django.contrib import admin
from .models import User, FavoriteRestaurant, Visit
from django.contrib.auth.admin import UserAdmin


class ProfileAdmin(admin.StackedInline):
    model = User
    con_delete = False


class CustomUserAdmin(UserAdmin):
    list_display = ('nickname', 'name', 'is_staff')
    list_filter = ('is_staff',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('uuid', 'nickname', 'name', 'birth', 'gender')}),
        ('Permissions', {'fields': ('is_staff',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('uuid', 'email', 'nickname', 'name', 'password', 'birth', 'gender', 'location'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


admin.site.register(User, CustomUserAdmin)
admin.site.register(FavoriteRestaurant)
admin.site.register(Visit)
